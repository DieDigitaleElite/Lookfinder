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
        - Die ersten 3 Vorschläge MÜSSEN sich deutlich voneinander und von der aktuellen Frisur auf dem Foto unterscheiden.
        - Es soll eine klare Typveränderung sichtbar sein, während sie dennoch perfekt zur Gesichtsform passen.
        1. VORSCHLAG: Muss eine MITTELLANGE Frisur sein (z.B. Bob-Varianten).
        2. VORSCHLAG: Muss eine LANGE Frisur sein.
        3. VORSCHLAG: Muss eine KURZHAARFRISUR sein (z.B. Pixie oder kurzer Shag).
        
        STRICT IDENTITY GUIDELINES:
        - Erhalte die Gesichtsmerkmale (Augen, Nase, Mund, Gesichtsform) zu 100% EXAKT.
        - Behalte die Original-Haarfarbe des Nutzers so nah wie möglich bei (nur minimale, harmonische Nuancen-Abweichungen erlaubt).
        - Die Augenfarbe und Blickrichtung dürfen NIEMALS verändert werden.
        - Der Fokus liegt auf der Erhaltung der Wiedererkennbarkeit.
        
        NEUES FELD "emotionalEnhancer":
        Erstelle für JEDEN Vorschlag einen kurzen, emotionalen Verstärker (max. 5-7 Wörter), der den User begeistert.
        Beispiele: "Betont deine Gesichtszüge perfekt", "Verleiht dir einen modernen, frischen Glow", "Bringt deine Augen optimal zur Geltung", "Ein eleganter Statement-Look für dich".
        Dieser Text wird direkt neben dem Score angezeigt.
        
        BEWERTUNG (rating):
        Bewerte wie gut diese Frisur zur Person passt. Berücksichtige: Gesichtsform, Proportionen, Harmonie, Trends, Natürlichkeit und Gesamtwirkung.
        Gib eine realistische Bewertung als GANZAHL zwischen 80 und 99 zurück.
        - 95–99: außergewöhnlich starke Matches
        - 90–94: sehr passende Looks
        - 85–89: gute Looks
        WICHTIG: Nutze niemals für alle Bilder den gleichen Wert (z.B. überall 98), das wirkt unglaubwürdig. Variiere die Zahlen.

        TONALITÄT FÜR "description" UND "suitabilityReason":
        - Du bist ein moderner Premium-Hairstylist und Beauty-Consultant.
        - Stimme: Positiv, glaubwürdig, modern, emotional, persönlich, nicht zu technisch.
        - Mix aus prof. Beratung, stylischer Freundin und moderner Beauty-App.
        - Vermeide generische Aussagen ("Sieht gut aus") oder Fachbegriffe.
        - "description": Fokus auf das "Gute Gefühl" und den Look.
        - "suitabilityReason": Maximal 4 kurze Sätze. Starte positiv, erkläre kurz den Fit zur Gesichtsform, nenne ein optisches Highlight und beschreibe den Vibe.
        
        Antworte ausschließlich im JSON-Format (Array von Objekten) mit: name, description, rating, emotionalEnhancer, barberInstructions, suitabilityReason, recommendedProducts, faceShape.`;

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
        
        const prompt = `Du bist ein moderner Premium-Hairstylist und Beauty-Consultant.
        Analysiere die Kombination aus der Frisur "${styleName}" in der Farbe "${colorName}" für eine Person mit einer ${faceShape}en Gesichtsform.
        Kontext zum gewählten Style: ${styleDescription}
        
        DEINE AUFGABE:
        Erstelle eine personalisierte, moderne Beschreibung und Bewertung.
        Tonalität: Positiv, glaubwürdig, emotional, persönlich, wie eine Mischung aus Profi-Beratung und stylischer Freundin. Keine Fachbegriffe.
        
        FELD "description": Fokus auf das Gefühl und den Gesamtlook. Modern und einladend.
        FELD "suitabilityReason": Maximal 4 kurze Sätze. Startet positiv, erklärt kurz warum es zur Gesichtsform passt, nennt ein optisches Highlight und beschreibe den Vibe.
        
        BEWERTUNG (rating):
        Bewerte wie gut diese Frisur zur Person passt (Gesichtsform, Proportionen, Harmonie, Trends).
        Gib eine realistische Bewertung als GANZAHL zwischen 80 und 99 zurück.
        
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
             promptSnippet = `Mache einen einfachen Schwarz-Weiß-"Bleistift"-Fashion-Sketch von dem Gesicht des hochgeladenen Bildes.
             Der Fokus liegt zu 100% auf dem Gesicht, um den User sofort wiedererkennbar zu machen.
             Stil: Minimalistischer Fashion-Sketch mit Bleistift-Schraffuren.
             Hintergrund: Rein Weiß.
             WICHTIG: Die Gesichtszüge müssen EXAKT beibehalten werden (Wiedererkennungswert).
             Für diesen speziellen Sketch: Zeichne das Gesicht ohne Haare (clean bald), aber mit einer ersten, angedeuteten Standard-Frisur.`;
          } else {
             promptSnippet = `Erstelle einen Schwarz-Weiß-Fashion-Sketch mit Bleistift-Stil (Pencil Sketch) von dem Gesicht der Person.
             WICHTIG: Ändere die Frisur zu: ${styleName}. Die Zeichnung MUSS den "${styleName}" exakt und deutlich erkennbar wiedergeben.
             Stil: Künstlerischer Bleistift-Fashion-Sketch, Fokus auf dem Gesicht und der neuen Frisur.
             Hintergrund: Rein Weiß.
             WICHTIG: Die Gesichtszüge müssen identisch zum Originalfoto bleiben, damit der User sich zu 100% wiedererkennt.`;
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
    
    // Search for subscriptions that are either active or trialing for this user
    // Subscriptions that are 'active' but 'cancel_at_period_end' are still returned here
    const searchResult = await stripeClient.subscriptions.search({
      query: `metadata['userId']:'${userId}' AND (status:'active' OR status:'trialing')`,
    });

    if (searchResult.data.length === 0) {
      return res.json({ 
        active: false,
        status: 'none'
      });
    }

    const sub = searchResult.data[0];
    res.json({
      active: true,
      id: sub.id,
      cancel_at_period_end: sub.cancel_at_period_end,
      current_period_end: sub.current_period_end,
      plan: sub.metadata.plan || 'monthly',
      status: sub.status
    });
  } catch (error: any) {
    console.error("Subscription Status Fetch Error:", error);
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
