// src/api-server.ts
import express from "express";
import Stripe from "stripe";
import cors from "cors";

let stripe: Stripe | null = null;

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "MY_STRIPE_SECRET_KEY" || key.trim() === "") {
    throw new Error("STRIPE_SECRET_KEY ist nicht konfiguriert.");
  }
  if (!stripe) {
    stripe = new Stripe(key);
  }
  return stripe;
}

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.json({ status: "online", message: "Frisuren.ai API" });
});

apiRouter.get("/test", (req, res) => {
  res.json({ 
    status: "ok", 
    isVercel: !!process.env.VERCEL,
    stripe: !!process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== "MY_STRIPE_SECRET_KEY"
  });
});

apiRouter.get("/get-client-ip", (req, res) => {
  let ip = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.ip || "unknown";
  if (Array.isArray(ip)) ip = ip[0];
  if (typeof ip === "string" && ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }
  res.json({ ip });
});

apiRouter.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan, userId, email } = req.body;
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
            description: "Unbegrenzte Analysen & Styling Tipps",
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
            description: "Unbegrenzter Zugriff für 1 Jahr",
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
            name: "Frisuren.ai - Einmalige Freischaltung",
            description: "Alle 9 Styles für dein Foto",
          },
          unit_amount: 299,
        },
        quantity: 1,
      }];
    }

    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["host"];
    const baseUrl = process.env.APP_URL || (host ? `${protocol}://${host}` : "https://frisuren.ai");

    const session = await stripeClient.checkout.sessions.create({
      line_items: lineItems,
      mode: mode,
      customer_email: email || undefined,
      client_reference_id: userId,
      subscription_data: mode === "subscription" ? {
        metadata: { userId, plan },
      } : undefined,
      metadata: { userId, plan: plan || 'single' },
      success_url: `${baseUrl}/?payment=success&plan=${plan || 'single'}&uid=${userId}`,
      cancel_url: `${baseUrl}/?payment=cancel`,
      allow_promotion_codes: true,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
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

app.use("/api", apiRouter);
app.use("/", apiRouter);

export default app;
