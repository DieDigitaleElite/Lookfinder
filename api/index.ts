import express from "express";
import Stripe from "stripe";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images

// Gemini initialization (server-side only)
let genAI: any = null;
function getGenAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.trim() === "") {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: key });
  }
  return genAI;
}

// Stripe initialization
let stripe: Stripe | null = null;

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.trim() === "" || key === "MY_STRIPE_SECRET_KEY") {
    throw new Error("STRIPE_SECRET_KEY is not configured in Vercel environment variables.");
  }
  
  if (!stripe) {
    stripe = new Stripe(key, {
      apiVersion: '2023-10-16' as any,
    });
  }
  return stripe;
}

// API Routes
app.get("/api/test", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "API is working on Vercel", 
    env: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    time: new Date().toISOString()
  });
});

app.get("/api/get-client-ip", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  res.json({ ip: Array.isArray(ip) ? ip[0] : ip });
});

app.post("/api/create-checkout-session", async (req, res) => {
  console.log("Vercel: Checkout request received:", req.body);
  try {
    const { plan, userId } = req.body;
    const stripeClient = getStripe();
    
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

    // On Vercel, we can use the host header to build the base URL
    const host = req.headers["host"];
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;

    const session = await stripeClient.checkout.sessions.create({
      line_items: lineItems,
      mode: mode,
      client_reference_id: userId,
      success_url: `${baseUrl}?payment=success&plan=${plan || 'single'}${userId ? `&uid=${userId}` : ''}`,
      cancel_url: `${baseUrl}?payment=cancel`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error("Vercel Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Gemini Proxy Endpoint
app.post("/api/gemini", async (req, res) => {
  try {
    const { model, contents, config } = req.body;
    
    if (!model || !contents) {
      return res.status(400).json({ error: "Missing model or contents in request body" });
    }

    const ai = getGenAI();
    
    // Use the correct pattern: ai.models.generateContent({ model, contents, config })
    const response = await ai.models.generateContent({
      model,
      contents,
      config
    });
    
    // We return the raw text or the parts to the frontend
    // Generating response using result.response is for legacy SDK.
    // In @google/genai, it directly returns the response or candidate parts.
    res.json({
      text: response.text,
      candidates: response.candidates
    });
  } catch (error: any) {
    console.error("Gemini API Error (Server):", error);
    res.status(500).json({ 
      error: error.message,
      details: error.status || "Unknown error"
    });
  }
});

// Catch-all for API routes
app.all("/api/*", (req, res) => {
  res.status(404).json({ 
    error: "API endpoint not found", 
    path: req.url,
    method: req.method 
  });
});

export default app;
