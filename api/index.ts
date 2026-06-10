// api/index.ts
import express from "express";
import Stripe from "stripe";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

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

// Help helper for GenAI image generation with fallback & candidate inspection
async function queryGenAIImageWithFallback(ai: any, model: string, parts: any[], safetySettings: any[], extraConfig: any = {}) {
  try {
    console.log(`Querying image model ${model}...`);
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: { safetySettings, ...extraConfig }
    });

    let imageData = null;
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData) {
          imageData = part.inlineData.data;
          break;
        }
      }
      if (imageData) break;
    }

    if (imageData) {
      console.log(`Successfully generated image using model ${model}. Data length: ${imageData.length}`);
      return { imageData, modelUsed: model };
    }

    const blockReason = response.candidates?.[0]?.finishReason;
    const errorDetails = `finishReason: ${blockReason || "unknown"}. text: ${response.text || "none"}`;
    console.warn(`Model ${model} returned no image: ${errorDetails}`);
    
    // Write detailed response details to server_error.log for real-time inspection
    try {
      fs.appendFileSync("server_error.log", `[${new Date().toISOString()}] Warning: model ${model} did not return inlineData. Details: ${errorDetails}. Parts: ${JSON.stringify(response.candidates?.[0]?.content?.parts)}\n`);
    } catch (_) {}

    throw new Error(`NO_IMAGE_DATA_RETURNED (${errorDetails})`);
  } catch (err: any) {
    console.warn(`Query for model ${model} failed with error:`, err.message || err);
    throw err;
  }
}

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
        const { base64Image } = payload;
        const mimeType = "image/jpeg"; // Enforce JPEG as all resized images are JPEGs. Fixes HEIC/PNG issues.
        
        const prompt = `Analysiere die Gesichtsform und Merkmale dieser Person auf dem Foto. Schlage genau 9 verschiedene Frisuren vor.
        REGELN FÜR DIE ERSTEN 3 VORSCHLÄGE (ABSOLUTE PFLICHT - KEEP IT SIMPLE):
        - Die ersten 3 Vorschläge MÜSSEN einfache, klassische und alltagstaugliche Frisuren sein, welche die ursprüngliche Naturhaarfarbe und Struktur des Nutzers zu 100% absolut unverändert beibehalten. Mit diesen Frisuren soll sich der Nutzer direkt perfekt wiedererkennen!
        - Es dürfen KEINE Farbexperimente oder Strähnen vorgeschlagen werden!
        - Die 3 Vorschläge müssen genau diesen Frisuren-Kategorien entsprechen:
          1. VORSCHLAG (Index 0): Mittellange Frisur (Ein schöner mittellanger Schnitt, z.B. ein eleganter klassischer Bob oder schulterlanger Schnitt in der exakten Naturhaarfarbe des Nutzers).
          2. VORSCHLAG (Index 1): Lange Frisur (Ein schöner Langhaarschnitt mit sanften Stufen in der exakten Naturhaarfarbe des Nutzers).
          3. VORSCHLAG (Index 2): Kurze Frisur (Eine schöne Kurzhaarfrisur, z.B. ein zeitloser, weicher Kurzhaarschnitt oder ein sanfter Pixie-Schnitt in der exakten Naturhaarfarbe des Nutzers, ohne Farbänderungen).
        
        STRICT IDENTITY GUIDELINES:
        - Erhalte die Gesichtsmerkmale (Augen, Nase, Mund, Gesichtsform) sowie die Gesichts- und Körperhaltung (kein Neigen nach vorne, Beugen oder Verzerren des Körpers) zu 100% EXAKT.
        - Behalte die Original-Haarfarbe und -Haarstruktur des Nutzers komplett bei (Farbe und Textur müssen exakt übereinstimmen).
        - Die Augenfarbe und Blickrichtung dürfen NIEMALS verändert werden.
        - Der Fokus liegt auf der Erhaltung der Wiedererkennbarkeit und absoluten Einfachheit.
        
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
          model: "gemini-3.5-flash",
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
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        res.json({ text: response.text });
        break;
      }

      case "generateImage": {
        const { base64Image, styleName, description, isSketch, baseSketch } = payload;
        const mimeType = "image/jpeg"; // Enforce JPEG for the resized original image
        
        const safetySettings = [
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ];

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
             if (baseSketch) {
                promptSnippet = `Du erhältst zwei Bilder als Input:
                1. Das Originalfoto des Benutzers (zur Referenz der Gesichtszüge und Identität).
                2. Eine fertige Schwarz-Weiß-Basis-Skizze (Glatze / Base-Sketch) desselben Gesichts.
                
                DEINE AUFGABE:
                Nimm exakt das Gesicht und die Struktur aus der Schwarz-Weiß-Basis-Skizze (Bild 2) als deine 100% identische Arbeitsgrundlage.
                Zeichne nun auf dieses Gesicht aus der Basis-Skizze die neue Frisur: "${styleName}".
                Die neue Frisur "${styleName}" muss extrem sauber, detailliert und erkennbar als Bleistift-Schraffur eingezeichnet werden.
                WICHTIG: Das Gesicht, die Augen, die Nase, der Mund und alle Schattierungen des Gesichts aus der Basis-Skizze (Bild 2) MÜSSEN zu 100% absolut unverändert, identisch und deckungsgleich bleiben. Zeichne ausschließlich das neue Haar um/auf diesen präzisen Kopf.
                Hintergrund: Rein weiß.`;
             } else {
                promptSnippet = `Erstelle einen Schwarz-Weiß-Fashion-Sketch mit Bleistift-Stil (Pencil Sketch) von dem Gesicht der Person.
                WICHTIG: Ändere die Frisur zu: ${styleName}. Die Zeichnung MUSS den "${styleName}" exakt und deutlich erkennbar wiedergeben.
                Stil: Künstlerischer Bleistift-Fashion-Sketch, Fokus auf dem Gesicht und der neuen Frisur.
                Hintergrund: Rein Weiß.
                WICHTIG: Die Gesichtszüge müssen identisch zum Originalfoto bleiben, damit der User sich zu 100% wiedererkennt.`;
             }
          }
        } else {
          promptSnippet = `### CRITICAL MANDATE: 100% IDENTICAL POSE, BODY, FACE & BACKDROP
You must generate a photorealistic image where ONLY the hair is replaced. All other elements (face, eyes, pose, body posture, clothing, background) must remain 100% UNCHANGED and pixel-identical to the source photo.

### KÖRPERSTELLUNG & KOPFHALTUNG (SPEZIELLE WARNUNG):
- NIEMALS nach vorne beugen, neigen, krümmen oder drehen! Die Körperstellung, Kopfstellung, Schultern, Pose und der Sitz-/Stehwinkel MÜSSEN absolut exakt, geradlinig und 100% identisch mit dem Eingangs-Originalfoto der Person übereinstimmen. Die Pose darf sich um keinen Millimeter verändern!

### GESICHT UND IDENTITÄT (SPEZIELLE WARNUNG):
- Das Gesicht, die Augenstruktur, Augenfarbe, Form der Nase, des Mundes, Lippen, Zähne, Make-up und die Mimik MÜSSEN zu 100% identisch und pixelgenau wie auf dem Originalfoto beibehalten werden. Absolut KEIN Weichzeichner, Filter, Verjüngung, Beauty-Filter oder Formänderung. Die Person muss sich perfekt wiedererkennen!

### HAARFARBE & STRUKTUR:
- Target Hairstyle (Ausgewählte Frisur): ${styleName}
- Target Color & Description: ${description}
- REGEL: Behalte die exakte Naturhaarfarbe und Grundstruktur des Originalfotos bei! Es dürfen ABSOLUT KEINE unaufgeforderten Farbänderungen (z.B. plötzliche Blondierung oder Farbabweichung) stattfinden. Wenn der Benutzer dunkle Haare hat, muss die Frisur exakt in dieser dunklen Haarfarbe gerendert werden, unter Beibehaltung der natürlichen Lichtreflexe.

### SEAMLESS 1K HD TRANSITION:
- Blende das neue Haar absolut nahtlos und perfekt an den Stirn- und Schläfenansatz sowie an den Nacken und die Schultern ein. Einzellinien und Strähnen sollen photorealistisch auf die Haut fallen. Generiere in maximaler High-End-Qualität.`;
        }

        const parts: any[] = [{ inlineData: { data: base64Image, mimeType } }];
        if (baseSketch) {
           const sketchMimeType = baseSketch.split(";")[0].split(":")[1];
           const sketchData = baseSketch.split(",")[1];
           parts.push({ inlineData: { data: sketchData, mimeType: sketchMimeType } });
        }
        parts.push({ text: promptSnippet });

        let result;
        if (isSketch) {
          try {
            // Attempt 1: gemini-2.5-flash-image (lighter, standard for simple pencil sketches)
            result = await queryGenAIImageWithFallback(ai, "gemini-2.5-flash-image", parts, safetySettings);
          } catch (err1: any) {
            console.warn("Attempt 1 with gemini-2.5-flash-image failed, retrying with gemini-3.1-flash-image...");
            try {
              // Attempt 2: gemini-3.1-flash-image
              result = await queryGenAIImageWithFallback(ai, "gemini-3.1-flash-image", parts, safetySettings);
            } catch (err2: any) {
              console.error("All image generation models failed!");
              throw new Error(`Bildgenerierung fehlgeschlagen: ${err2.message || err2}`);
            }
          }
        } else {
          try {
            // Attempt 1 for photorealistic is gemini-3.1-flash-image for maximum 1K HD premium quality (extremely snappy and reliable)
            result = await queryGenAIImageWithFallback(ai, "gemini-3.1-flash-image", parts, safetySettings, {
              imageConfig: {
                imageSize: "1K"
              }
            });
          } catch (err1: any) {
            console.warn("Attempt 1 with gemini-3.1-flash-image failed, retrying with gemini-2.5-flash-image as fallback...");
            try {
              // Attempt 2: gemini-2.5-flash-image
              result = await queryGenAIImageWithFallback(ai, "gemini-2.5-flash-image", parts, safetySettings);
            } catch (err2: any) {
              console.error("All image generation models failed!");
              throw new Error(`Bildgenerierung fehlgeschlagen: ${err2.message || err2}`);
            }
          }
        }
        
        res.json({ imageData: result.imageData, modelUsed: result.modelUsed });
        break;
      }

      default:
        res.status(400).json({ error: "Invalid action" });
    }
  } catch (error: any) {
    const errorMsg = error.message || "Unbekannter Fehler";
    const stack = error.stack || "";
    console.error("Gemini Proxy error:", errorMsg.replace(/AIza[0-9A-Za-z-_]{35}/g, "[HIDDEN_KEY]"));
    
    // Log to a file we can inspect
    try {
      fs.appendFileSync("server_error.log", `[${new Date().toISOString()}] Action: ${req.body?.action || "unknown"} Error: ${errorMsg}\nStack: ${stack}\n\n`);
    } catch (logErr) {
      console.error("Failed to write to server_error.log", logErr);
    }
    
    // Translate the error message to high-quality user-friendly German
    const lower = errorMsg.toLowerCase();
    let userMessage = "Ein interner Fehler im KI-Dienst ist aufgetreten.";
    
    if (lower.includes("429") || lower.includes("rate limit") || lower.includes("quota") || lower.includes("overloaded") || lower.includes("exhausted")) {
      userMessage = "Die KI ist gerade überlastet (Ansturm zu hoch). Bitte warte einen kurzen Moment und klicke auf 'Neuladen'.";
    } else if (lower.includes("safety") || lower.includes("block") || lower.includes("blocked") || lower.includes("finish_reason") || lower.includes("harm")) {
      userMessage = "Das Foto wurde von den Sicherheitsfiltern der KI blockiert. Bitte lade ein Foto hoch, auf dem dein Gesicht klar, frontal, unverdeckt und gut ausgeleuchtet zu sehen ist.";
    } else if (lower.includes("api_key") || lower.includes("key") || lower.includes("unauthorized") || lower.includes("invalid key") || lower.includes("forbidden") || lower.includes("403")) {
      userMessage = "Der KI-Dienst ist derzeit aufgrund eines Konfigurationsfehlers nicht erreichbar. Bitte kontaktiere unseren Support.";
    } else if (lower.includes("not found") || lower.includes("404")) {
      userMessage = "Der aufgerufene KI-Modell-Dienst wurde nicht gefunden oder ist vorübergehend deaktiviert.";
    } else if (lower.includes("timeout") || lower.includes("504") || lower.includes("gateway")) {
      userMessage = "Die Verbindung zum KI-Dienst hat zu lange gedauert. Bitte versuche es noch einmal.";
    } else {
      // Return a friendly message with a safe sanitized snippet of the actual model error
      let shortMsg = errorMsg.replace(/AIza[0-9A-Za-z-_]{35}/g, "[SECRET_KEY]");
      if (shortMsg.length > 60) {
        shortMsg = shortMsg.substring(0, 60) + "...";
      }
      userMessage = `Ein interner Fehler im KI-Dienst ist aufgetreten (${shortMsg}).`;
    }
      
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
      allow_promotion_codes: true,
      customer_email: email || undefined,
      client_reference_id: userId,
      success_url: `${baseUrl}/?payment=success&plan=${plan || 'single'}&uid=${userId}&session_id={CHECKOUT_SESSION_ID}`,
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
