// api/index.ts
import express from "express";
import Stripe from "stripe";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Gemini Proxy Implementation
const getGeminiAI = () => {
  // Try common keys in order, prioritizing the platform's API_KEY
  const key = process.env.API_KEY || 
              process.env.GEMINI_API_KEY || 
              process.env.GOOGLE_API_KEY || 
              process.env.VITE_GEMINI_API_KEY;
  
  if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
    const env = process.env.NODE_ENV || "development";
    console.warn("API Key Check Failed. Env keys:", Object.keys(process.env).filter(k => k.toLowerCase().includes('key')));
    
    if (env === "production") {
      throw new Error("CONFIG_ERROR: No valid API\_KEY found in environment.");
    }
    throw new Error("GEMINI_API_KEY fehlt. Bitte füge deinen API Key in den AI Studio Secrets unter dem Namen 'GEMINI_API_KEY' hinzu.");
  }
  return new GoogleGenAI({ apiKey: key });
};

// --- API GUIDELINES ---
// Health checks
app.get("/api/health", (req, res) => res.status(200).send("OK"));

// Gemini Endpoint
app.post("/api/gemini", async (req, res) => {
  try {
    const { action, payload } = req.body;
    const ai = getGeminiAI();

    switch (action) {
      case "analyzeFace": {
        const { base64Image, mimeType } = payload;
        
        const prompt = `Analysiere die Gesichtsform und Merkmale dieser Person. Schlage 9 verschiedene Frisuren vor.
        REGELN FÜR DIE ERSTEN 3 VORSCHLÄGE (PFLICHT):
        1. VORSCHLAG: Muss eine MITTELLANGE Frisur sein.
        2. VORSCHLAG: Muss eine LANGE Frisur sein.
        3. VORSCHLAG: Muss eine KURZHAARFRISUR sein.
        
        STRICT IDENTITY GUIDELINES:
        - Die ersten 3 Vorschläge MÜSSEN die Original-Haarfarbe und -Struktur berücksichtigen.
        - Der Fokus liegt zu 100% auf der Erhaltung der Identität der Person.
        - Die Frisuren müssen perfekt zur Gesichtsform passen.
        
        Antworte ausschließlich im JSON-Format (Array von Objekten) mit: name, description, rating, barberInstructions, suitabilityReason, recommendedProducts, faceShape.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: {
            parts: [
              { inlineData: { data: base64Image, mimeType } },
              { text: prompt }
            ]
          },
          config: {
            responseMimeType: "application/json"
          }
        });
        
        res.json({ text: response.text });
        break;
      }

      case "getMetadata": {
        const { faceShape, styleName, colorName, styleDescription } = payload;
        
        const prompt = `Du bist ein professioneller Star-Friseur. 
        Analysiere die Kombination aus der Frisur "${styleName}" in der Farbe "${colorName}" für eine person mit einer ${faceShape}en Gesichtsform.
        Kontext zum gewählten Style: ${styleDescription}
        Antworte ausschließlich im JSON-Format mit den Schlüsseln: description, suitabilityReason, barberInstructions, rating.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        res.json({ text: response.text });
        break;
      }

      case "generateImage": {
        const { base64Image, mimeType, styleName, description, isSketch, baseSketch } = payload;
        const model = "gemini-2.5-flash-image";
        
        let promptSnippet = "";
        if (isSketch) {
          if (payload.isBase) {
             promptSnippet = `STRICT IDENTITY GUIDELINE: Create a high-end, minimalist charcoal fashion sketch of the EXACT face provided. 
             DO NOT ALTER facial features, eye shape, nose structure, or expression. 
             Render ONLY the head and neck with a clean bald head. 
             Use clean ink lines on a pure white background. The goal is to perfectly preserve the person's identity in sketch form.`;
          } else {
             promptSnippet = `STRICT IDENTITY GUIDELINE: Create a high-end fashion illustration of the person with the hairstyle: ${styleName}. 
             The face must remain 100% IDENTICAL to the original. DO NOT change the eyes, nose, mouth, face shape, or head orientation. 
             Only change the hair. Use a clean white background.`;
          }
        } else {
          promptSnippet = `ULTRA-REALISTIC HAIRSTYLE SWAP: Photograph of the person with the new hairstyle: ${styleName}. 
          ${description}. 
          CRITICAL: The face and environment MUST be 100% identical to the source image. 
          KEEP UNCHANGED: Eyes (color, shape, position), Nose, Mouth, Chin, Skin tone, Lighting on the face, Head tilt, and the EXACT BACKGROUND. 
          The ONLY change allowed is the hairstyle. The transition from hair to skin (hairline) must be seamless and photorealistic. 
          DO NOT manipulate or 'beautify' the original face or background. Identity and environment preservation is the absolute priority.`;
        }

        const parts: any[] = [{ inlineData: { data: base64Image, mimeType } }];
        if (baseSketch) {
           const sketchMimeType = baseSketch.split(";")[0].split(":")[1];
           const sketchData = baseSketch.split(",")[1];
           parts.push({ inlineData: { data: sketchData, mimeType: sketchMimeType } });
        }
        parts.push({ text: promptSnippet });

        const response = await ai.models.generateContent({
          model: model,
          contents: { parts }
        });
        
        let imageData = null;
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            imageData = part.inlineData.data;
            break;
          }
        }
        
        if (imageData) {
           res.json({ imageData });
        } else {
           res.json({ text: response.text });
        }
        break;
      }

      default:
        res.status(400).json({ error: "Invalid action" });
    }
  } catch (error: any) {
    const errorMsg = error.message || "Unbekannter Fehler";
    console.error("Gemini Proxy error:", errorMsg.replace(/AIza[0-9A-Za-z-_]{35}/g, "[HIDDEN_KEY]"));
    
    // Provide slightly more detail in non-production to help the user
    const isProd = process.env.NODE_ENV === "production";
    const userMessage = isProd 
      ? "Ein interner Fehler im KI-Dienst ist aufgetreten." 
      : `KI-Fehler: ${errorMsg.substring(0, 100)}`;
      
    res.status(500).json({ error: userMessage });
  }
});

let stripeClientInstance: Stripe | null = null;

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "MY_STRIPE_SECRET_KEY" || key.trim() === "") {
    throw new Error("STRIPE_SECRET_KEY missing");
  }
  if (!stripeClientInstance) {
    stripeClientInstance = new Stripe(key);
  }
  return stripeClientInstance;
}

app.get("/api/get-client-ip", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.ip || "unknown";
  res.json({ ip });
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { plan, userId, email } = req.body;
    if (!userId) return res.status(400).json({ error: "UserID is required" });

    const stripeClient = getStripe();
    let lineItems: any[] = [];
    let mode: "payment" | "subscription" = "payment";
    
    if (plan === "monthly") {
      mode = "subscription";
      lineItems = [{
        price_data: {
          currency: "eur",
          product_data: { name: "Frisuren.ai - Pro Monatsabo" },
          unit_amount: 999,
          recurring: { interval: "month" },
        },
        quantity: 1,
      }];
    } else if (plan === "yearly") {
      mode = "subscription";
      lineItems = [{
        price_data: {
          currency: "eur",
          product_data: { name: "Frisuren.ai - Pro Jahresabo" },
          unit_amount: 3999,
          recurring: { interval: "year" },
        },
        quantity: 1,
      }];
    } else if (plan === "studio-single") {
      mode = "payment";
      lineItems = [{
        price_data: {
          currency: "eur",
          product_data: { name: "Frisuren.ai - Styling Studio (Einzelbild)" },
          unit_amount: 149,
        },
        quantity: 1,
      }];
    } else {
      mode = "payment";
      lineItems = [{
        price_data: {
          currency: "eur",
          product_data: { name: "Frisuren.ai - Einmalig" },
          unit_amount: 299,
        },
        quantity: 1,
      }];
    }

    const host = req.headers["host"] || "frisuren.ai";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;

    const session = await stripeClient.checkout.sessions.create({
      line_items: lineItems,
      mode: mode,
      customer_email: email || undefined,
      client_reference_id: userId,
      success_url: `${baseUrl}/?payment=success&plan=${plan || 'single'}&uid=${userId}`,
      cancel_url: `${baseUrl}/?payment=cancel`,
      metadata: { userId, plan: plan || 'single' },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/subscription-status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const stripeClient = getStripe();
    const searchResult = await stripeClient.subscriptions.search({
      query: `metadata['userId']:'${userId}' AND status:'active'`,
    });
    if (searchResult.data.length === 0) return res.json({ active: false });
    const sub = searchResult.data[0];
    res.json({
      active: true,
      id: sub.id,
      cancel_at_period_end: sub.cancel_at_period_end,
      current_period_end: sub.current_period_end,
      plan: sub.metadata.plan || 'unknown',
      status: sub.status
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/create-portal-session", async (req, res) => {
  try {
    const { email, origin } = req.body;
    const stripeClient = getStripe();
    
    // Find customer by email
    const customers = await stripeClient.customers.list({
      email: email,
      limit: 1
    });

    if (customers.data.length === 0) {
      return res.status(404).json({ error: "Kein Stripe-Kunde mit dieser E-Mail gefunden." });
    }

    const session = await stripeClient.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${origin}/?tab=account`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Portal Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// For local dev where we might not have /api rewrite
app.get("/test", (req, res) => res.json({ status: "ok", from: "root" }));

// Usage Increment Endpoint
app.post("/api/usage/increment", async (req, res) => {
  try {
    const { userId } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.ip || "unknown";
    const actualIp = Array.isArray(ip) ? ip[0] : ip.split(',')[0].trim();
    
    // Use the provided userId if available, otherwise fall back to IP
    const targetId = (userId && userId !== "unknown") ? userId : actualIp;
    
    // We can't easily use the Firebase Admin SDK here without the service account key,
    // so for now, we'll keep the client-side usage increment but limit the rules better.
    // HOWEVER, to be truly secure, we should provide a way for the backend to write to Firestore.
    
    res.json({ status: "ok", targetId });
  } catch (error) {
    res.status(500).json({ error: "Internal Error" });
  }
});

export default app;
