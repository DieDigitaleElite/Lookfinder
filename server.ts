// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

let ai: GoogleGenAI | null = null;
function getAI() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY not found in environment.");
      return null;
    }
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

let stripe: Stripe | null = null;

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "MY_STRIPE_SECRET_KEY" || key.trim() === "") {
    console.error("Stripe key is missing or is a placeholder.");
    throw new Error("STRIPE_SECRET_KEY ist nicht konfiguriert. Bitte füge deinen Stripe Secret Key (sk_test_... oder sk_live_...) im AI Studio unter 'Settings' -> 'Secrets' hinzu.");
  }
  
  if (!key.startsWith('sk_')) {
    console.error("Stripe key does not start with sk_");
    throw new Error("Der Stripe Secret Key scheint ungültig zu sein (er sollte mit 'sk_' beginnen).");
  }

  if (!stripe) {
    stripe = new Stripe(key, {
      apiVersion: '2023-10-16' as any,
    });
  }
  return stripe;
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes
const apiRouter = express.Router();

apiRouter.get("/test", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "API is working", 
    env: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
});

apiRouter.get("/firebase-config", (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || process.env.VITE_FIREBASE_MEASUREMENT_ID,
    firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || process.env.VITE_FIREBASE_DATABASE_ID,
  });
});

  apiRouter.get("/get-client-ip", (req, res) => {
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    if (typeof ip === "string" && ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }
    res.json({ ip: Array.isArray(ip) ? ip[0] : ip });
  });

apiRouter.post("/ai/analyze-face", async (req, res) => {
  try {
    const { base64Image, mimeType, prompt } = req.body;
    const ai = getAI();
    if (!ai) throw new Error("AI not configured");
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        role: "user",
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: prompt }
        ]
      }],
      config: {
        responseMimeType: "application/json",
      }
    });

    res.json({ text: response.text || "" });
  } catch (err: any) {
    console.error("AI Analysis error:", err);
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post("/ai/styling-metadata", async (req, res) => {
  try {
    const { prompt } = req.body;
    const ai = getAI();
    if (!ai) throw new Error("AI not configured");

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    res.json({ text: response.text || "" });
  } catch (err: any) {
    console.error("AI Metadata error:", err);
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post("/ai/generate-image", async (req, res) => {
  try {
    const { parts, model: modelName } = req.body;
    const ai = getAI();
    if (!ai) throw new Error("AI not configured");

    const response = await ai.models.generateContent({
      model: modelName || "gemini-2.5-flash-image",
      contents: [{ role: "user", parts }]
    });

    const responseParts = response.candidates?.[0]?.content?.parts || [];
    let imageData = null;
    for (const part of responseParts) {
      if (part.inlineData) {
        imageData = part.inlineData.data;
        break;
      }
    }

    res.json({ imageData });
  } catch (err: any) {
    console.error("AI Generation error:", err);
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post("/create-checkout-session", async (req, res) => {
  console.log("Checkout request received at /api/create-checkout-session:", req.body);
  try {
    const { plan, userId } = req.body;
    console.log(`Plan: ${plan}, UserID: ${userId}`);
    const stripeClient = getStripe();
    console.log("Stripe client initialized");
    
    let lineItems: any[] = [];
    let mode: "payment" | "subscription" = "payment";
    
    if (plan === "monthly") {
      mode = "subscription";
      lineItems = [{
        price_data: {
          currency: "eur",
          product_data: {
            name: "Frisuren.ai Monatsabo",
            description: "Flexibel jederzeit kündbar - Alle Styles & Trends",
          },
          unit_amount: 999,
          recurring: { interval: "month" },
        },
        quantity: 1,
      }];
    } else if (plan === "upsell") {
      mode = "subscription";
      lineItems = [{
        price_data: {
          currency: "eur",
          product_data: {
            name: "Frisuren.ai Pro Upgrade (Unlimited)",
            description: "Upgrade auf Monatsabo - Alle Styles & Trends unbegrenzt",
          },
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
          product_data: {
            name: "Frisuren.ai Styling-Flatrate Jahresabo",
            description: "Unbegrenzt testen + monatlich neue Trends + Profi-Guide",
          },
          unit_amount: 3999,
          recurring: { interval: "year" },
        },
        quantity: 1,
      }];
    } else {
      // Default to single unlock
      mode = "payment";
      lineItems = [{
        price_data: {
          currency: "eur",
          product_data: {
            name: "Frisuren.ai Single Unlock",
            description: "Schalte alle 9 Frisuren für diese Analyse frei",
          },
          unit_amount: 299,
        },
        quantity: 1,
      }];
    }

    const protocol = req.headers["x-forwarded-proto"] || (req.headers.host?.includes('localhost') ? 'http' : 'https');
    const host = req.headers["host"] || "localhost:3000";
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
    console.log(`Creating checkout session with baseUrl: ${baseUrl} (Protocol: ${protocol}, Host: ${host}) for user: ${userId}`);

    const session = await stripeClient.checkout.sessions.create({
      line_items: lineItems,
      mode: mode,
      client_reference_id: userId,
      subscription_data: mode === "subscription" ? {
        metadata: {
          userId: userId,
        },
      } : undefined,
      metadata: {
        userId: userId,
        plan: plan,
      },
      success_url: `${baseUrl}?payment=success&plan=${plan || 'single'}${userId ? `&uid=${userId}` : ''}`,
      cancel_url: `${baseUrl}?payment=cancel`,
    });

    console.log("Stripe session created:", session.id);
    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe error details:", error);
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get("/subscription-status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const stripeClient = getStripe();
    
    // Search for active subscriptions for this user
    // Note: This matches the metadata we added above
    const subscriptions = await stripeClient.subscriptions.list({
      limit: 1,
      status: 'active',
      expand: ['data.default_payment_method'],
    });
    
    // Stripe list doesn't support direct filtering by metadata in the list() call for subscriptions easily without search
    // So we'll filter manually or use search if available
    // Better: use search
    const searchResult = await stripeClient.subscriptions.search({
      query: `metadata['userId']:'${userId}' AND status:'active'`,
    });

    if (searchResult.data.length === 0) {
      return res.json({ active: false });
    }

    const sub = searchResult.data[0];
    res.json({
      active: true,
      id: sub.id,
      cancel_at_period_end: sub.cancel_at_period_end,
      current_period_end: sub.current_period_end,
      plan: sub.metadata.plan || 'unknown'
    });
  } catch (error: any) {
    console.error("Error fetching subscription status:", error);
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/cancel-subscription", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    const stripeClient = getStripe();
    
    // Find active subscription
    const searchResult = await stripeClient.subscriptions.search({
      query: `metadata['userId']:'${userId}' AND status:'active'`,
    });

    if (searchResult.data.length === 0) {
      return res.status(404).json({ error: "No active subscription found for this user." });
    }

    const sub = searchResult.data[0];
    
    // Update to cancel at period end
    const updatedSub = await stripeClient.subscriptions.update(sub.id, {
      cancel_at_period_end: true,
    });

    res.json({ 
      success: true, 
      message: "Subscription will cancel at the end of the period.",
      cancel_at_period_end: updatedSub.cancel_at_period_end,
      current_period_end: updatedSub.current_period_end
    });
  } catch (error: any) {
    console.error("Error cancelling subscription:", error);
    res.status(500).json({ error: error.message });
  }
});

apiRouter.all("*", (req, res) => {
  console.warn(`[API] 404 - Not Found: ${req.method} ${req.originalUrl || req.url} (Mapped path: ${req.url})`);
  res.status(404).json({ 
    error: "API Route not found", 
    method: req.method, 
    path: req.originalUrl || req.url,
    suggestedPath: "/api/test"
  });
});

app.use("/api", apiRouter);

async function startServer() {
  console.log("Starting server with NODE_ENV:", process.env.NODE_ENV);
  
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Only listen if not on Vercel
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
