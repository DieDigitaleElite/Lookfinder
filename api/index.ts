// api/index.ts
import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Health checks
app.get("/api/health", (req, res) => res.status(200).send("OK"));
app.get("/api/test", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Simple API test",
    stripe: !!process.env.STRIPE_SECRET_KEY
  });
});

let stripe: Stripe | null = null;

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "MY_STRIPE_SECRET_KEY" || key.trim() === "") {
    throw new Error("STRIPE_SECRET_KEY missing");
  }
  if (!stripe) {
    stripe = new Stripe(key);
  }
  return stripe;
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

export default app;
