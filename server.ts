// server.ts
import express from "express";
import path from "path";
import Stripe from "stripe";
import cors from "cors";

let stripe: Stripe | null = null;

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "MY_STRIPE_SECRET_KEY" || key.trim() === "") {
    console.error("Stripe key is missing or is a placeholder.");
    throw new Error("STRIPE_SECRET_KEY ist nicht konfiguriert. Bitte füge deinen Stripe Secret Key im AI Studio unter 'Settings' -> 'Secrets' hinzu.");
  }
  
  if (!key.startsWith('sk_')) {
    console.error("Stripe key does not start with sk_");
    throw new Error("Der Stripe Secret Key scheint ungültig zu sein (er sollte mit 'sk_' beginnen).");
  }

  if (!stripe) {
    // Using default version to avoid compatibility issues
    stripe = new Stripe(key);
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
    time: new Date().toISOString(),
    isVercel: !!process.env.VERCEL
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
  // Use Express's built-in req.ip which handles x-forwarded-for if 'trust proxy' is on
  // For Vercel, x-forwarded-for is correctly set
  let ip = req.headers["x-forwarded-for"] || req.ip || "unknown";
  if (Array.isArray(ip)) ip = ip[0];
  if (typeof ip === "string" && ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }
  res.json({ ip });
});

apiRouter.all(["/create-checkout-session", "/create-checkout-session/"], async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[Stripe ${requestId}] Request: ${req.method} ${req.url}`);
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: "Method Not Allowed", 
      message: `POST erforderlich. Erhalten: ${req.method}`,
      debug: { method: req.method, url: req.url }
    });
  }

  try {
    const { plan, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "UserID ist erforderlich." });

    const stripeClient = getStripe();
    
    let lineItems: any[] = [];
    let mode: "payment" | "subscription" = "payment";
    
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

    const session = await stripeClient.checkout.sessions.create({
      line_items: lineItems,
      mode: mode,
      customer_email: req.body.email || undefined,
      client_reference_id: userId,
      subscription_data: mode === "subscription" ? {
        metadata: { userId: userId, plan: plan },
      } : undefined,
      metadata: { userId: userId, plan: plan || 'single' },
      success_url: `${baseUrl.replace(/\/$/, '')}/?payment=success&plan=${plan || 'single'}${userId ? `&uid=${userId}` : ''}`,
      cancel_url: `${baseUrl.replace(/\/$/, '')}/?payment=cancel`,
      allow_promotion_codes: true,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error(`[Stripe ${requestId}] Error:`, error);
    res.status(500).json({ error: "Stripe-Fehler", message: error.message });
  }
});

apiRouter.get("/subscription-status/:userId", async (req, res) => {
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

apiRouter.post("/cancel-subscription", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "UserId ist erforderlich." });

    const stripeClient = getStripe();
    const searchResult = await stripeClient.subscriptions.search({
      query: `metadata['userId']:'${userId}' AND status:'active'`,
    });

    if (searchResult.data.length === 0) return res.status(404).json({ error: "Kein aktives Abo gefunden." });

    const sub = searchResult.data[0];
    const updatedSub = await stripeClient.subscriptions.update(sub.id, {
      cancel_at_period_end: true,
    });

    res.json({ 
      success: true, 
      message: "Dein Abo wird zum Ende der aktuellen Laufzeit gekündigt.",
      cancel_at_period_end: updatedSub.cancel_at_period_end,
      current_period_end: updatedSub.current_period_end
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.all("*", (req, res) => {
  res.status(404).json({ error: "API Route not found" });
});

app.use("/api", apiRouter);

// Start server function (only for local development)
async function boot() {
  if (process.env.VERCEL) return;
  
  if (process.env.NODE_ENV !== "production") {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite failed to load locally.");
    }
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Guard boot call
if (!process.env.VERCEL) {
  boot();
}

export default app;
