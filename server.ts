import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// AI Setup
let genAI: GoogleGenerativeAI | null = null;
function getGenAI() {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
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

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  // Shorten headers for logs
  const safeHeaders = { ...req.headers };
  if (safeHeaders.authorization) safeHeaders.authorization = "[REDACTED]";
  if (safeHeaders.cookie) safeHeaders.cookie = "[REDACTED]";
  console.log(`Headers: ${JSON.stringify(safeHeaders)}`);
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

apiRouter.get("/get-client-ip", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  res.json({ ip: Array.isArray(ip) ? ip[0] : ip });
});

apiRouter.post("/ai/generate", async (req, res) => {
  try {
    const { model, contents, config } = req.body;
    const ai = getGenAI();
    const genModel = ai.getGenerativeModel({ model });
    
    const result = await genModel.generateContent({
      contents,
      generationConfig: config
    });
    
    const response = await result.response;
    const text = response.text();
    
    // Check for inlineData (images) in parts
    const parts = response.candidates?.[0]?.content?.parts || [];
    const images = parts.filter(p => !!p.inlineData).map(p => ({
      data: p.inlineData?.data,
      mimeType: p.inlineData?.mimeType
    }));

    res.json({ 
      text,
      images,
      candidates: response.candidates 
    });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    res.status(500).json({ error: error.message });
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
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: mode,
      client_reference_id: userId,
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

apiRouter.all("*", (req, res) => {
  console.warn(`API Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: "API Route not found", 
    method: req.method, 
    url: req.url 
  });
});

app.use("/api", apiRouter);
// Also mount at root for Vercel functions where the /api path might be stripped by the serverless loader
if (process.env.VERCEL) {
  app.use("/", apiRouter);
}

async function startServer() {
  console.log("Starting server with NODE_ENV:", process.env.NODE_ENV);
  
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // For SPA routing in dev mode
    app.get("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        if (url.startsWith('/api')) return next();
        
        // Let Vite handle it
        next();
      } catch (e) {
        next(e);
      }
    });
  } else if (!process.env.VERCEL) {
    // Standard Node.js production environment (not Vercel)
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
