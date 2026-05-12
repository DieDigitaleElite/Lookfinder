// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";
import dotenv from "dotenv";

import cors from "cors";

dotenv.config();

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

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '20mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Router
const apiRouter = express.Router();

// Apply CORS to the router as well
apiRouter.use(cors());

apiRouter.get("/", (req, res) => {
  res.json({ 
    status: "online", 
    message: "Frisuren.ai API is running",
    timestamp: new Date().toISOString()
  });
});

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

// GET handler for debugging
apiRouter.all(["/create-checkout-session", "/create-checkout-session/"], async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[Stripe ${requestId}] Request: ${req.method} ${req.url} (Original: ${req.originalUrl})`);
  
  // Explicitly handle OPTIONS for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.warn(`[Stripe ${requestId}] Rejected ${req.method} request (Expect POST)`);
    return res.status(405).json({ 
      error: "Method Not Allowed", 
      message: `Der Server hat einen ${req.method} Request erhalten, aber /api/create-checkout-session benötigt POST.`,
      debug: { method: req.method, url: req.url, originalUrl: req.originalUrl }
    });
  }

  try {
    const { plan, userId } = req.body;
    console.log(`[Stripe ${requestId}] Plan: ${plan}, UserID: ${userId}`);
    
    if (!userId) {
      console.error(`[Stripe ${requestId}] Missing userId in request body`);
      return res.status(400).json({ error: "UserID ist erforderlich für den Checkout." });
    }

    const stripeClient = getStripe();
    
    let lineItems: any[] = [];
    let mode: "payment" | "subscription" = "payment";
    
    // Plan definitions
    if (plan === "monthly") {
      mode = "subscription";
      lineItems = [{
        price_data: {
          currency: "eur",
          product_data: {
            name: "Frisuren.ai - Pro Monatsabo",
            description: "Unbegrenzte Analysen & Styling Tipps - monatlich kündbar",
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
            name: "Frisuren.ai - Pro Jahresabo",
            description: "Bestes Preis-Leistungs-Verhältnis - Unbegrenzter Zugriff für 1 Jahr",
          },
          unit_amount: 3999,
          recurring: { interval: "year" },
        },
        quantity: 1,
      }];
    } else if (plan === "upsell") {
      mode = "subscription";
      lineItems = [{
        price_data: {
          currency: "eur",
          product_data: {
            name: "Frisuren.ai - Pro Upgrade",
            description: "Upgrade auf vollen Funktionsumfang (Monatlich)",
          },
          unit_amount: 999,
          recurring: { interval: "month" },
        },
        quantity: 1,
      }];
    } else {
      // Single Unlock (One-time payment)
      mode = "payment";
      lineItems = [{
        price_data: {
          currency: "eur",
          product_data: {
            name: "Frisuren.ai - Einmalige Freischaltung",
            description: "Alle 9 personalisierten Styles für dein hochgeladenes Gesicht",
          },
          unit_amount: 299,
        },
        quantity: 1,
      }];
    }

    const protocol = req.headers["x-forwarded-proto"] || (req.headers.host?.includes('localhost') ? 'http' : 'https');
    const host = req.headers["host"] || "localhost:3000";
    const baseUrl = process.env.APP_URL || req.headers.origin || `${protocol}://${host}`;
    
    console.log(`[Stripe ${requestId}] Creating session with baseUrl: ${baseUrl}`);

    const session = await stripeClient.checkout.sessions.create({
      line_items: lineItems,
      mode: mode,
      customer_email: req.body.email || undefined, // Prefill email if available
      client_reference_id: userId,
      subscription_data: mode === "subscription" ? {
        metadata: {
          userId: userId,
          plan: plan
        },
      } : undefined,
      metadata: {
        userId: userId,
        plan: plan || 'single',
      },
      success_url: `${baseUrl.replace(/\/$/, '')}/?payment=success&plan=${plan || 'single'}${userId ? `&uid=${userId}` : ''}`,
      cancel_url: `${baseUrl.replace(/\/$/, '')}/?payment=cancel`,
      allow_promotion_codes: true,
    });

    console.log(`[Stripe ${requestId}] Session Success: ${session.id}`);
    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error(`[Stripe ${requestId}] Error:`, error);
    res.status(500).json({ 
      error: "Stripe-Fehler", 
      message: error.message,
      type: error.type 
    });
  }
});

apiRouter.get("/subscription-status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`[Subscription Status] Checking for: ${userId}`);
    const stripeClient = getStripe();
    
    // First find the customer by email or just search subscriptions by metadata which is safer
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
      plan: sub.metadata.plan || 'unknown',
      status: sub.status
    });
  } catch (error: any) {
    console.error(`[Subscription Status] Error:`, error);
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/cancel-subscription", async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(`[Cancel Subscription] Request for: ${userId}`);
    
    if (!userId) {
      return res.status(400).json({ error: "UserId ist erforderlich." });
    }

    const stripeClient = getStripe();
    const searchResult = await stripeClient.subscriptions.search({
      query: `metadata['userId']:'${userId}' AND status:'active'`,
    });

    if (searchResult.data.length === 0) {
      return res.status(404).json({ error: "Kein aktives Abo gefunden." });
    }

    const sub = searchResult.data[0];
    
    // Update the subscription to cancel at the end of the current period
    const updatedSub = await stripeClient.subscriptions.update(sub.id, {
      cancel_at_period_end: true,
    });

    console.log(`[Cancel Subscription] Success for: ${sub.id}`);
    res.json({ 
      success: true, 
      message: "Dein Abo wird zum Ende der aktuellen Laufzeit gekündigt.",
      cancel_at_period_end: updatedSub.cancel_at_period_end,
      current_period_end: updatedSub.current_period_end
    });
  } catch (error: any) {
    console.error(`[Cancel Subscription] Error:`, error);
    res.status(500).json({ error: error.message });
  }
});

apiRouter.all("*", (req, res) => {
  console.warn(`[API] 404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: "API Route not found" });
});

// API Router must be mounted BEFORE static files and Vite
app.use("/api", apiRouter);

async function startServer() {
  console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode...`);
  
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    // Only serve static files here if NOT on Vercel
    // Vercel handles static files via its own routing/rewrites
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
