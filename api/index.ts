import express from "express";
import Stripe from "stripe";

const app = express();
app.use(express.json());

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
            name: "HairVision Monatsabo",
            description: "Flexibel jederzeit kündbar - Alle Styles & Trends",
          },
          unit_amount: 699,
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
            name: "HairVision Pro Upgrade (Unlimited)",
            description: "Upgrade auf Monatsabo - Alle Styles & Trends unbegrenzt",
          },
          unit_amount: 400,
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
            name: "HairVision Styling-Flatrate Jahresabo",
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
            name: "HairVision Single Unlock",
            description: "Schalte alle 9 Frisuren für diese Analyse frei",
          },
          unit_amount: 199,
        },
        quantity: 1,
      }];
    }

    // On Vercel, we can use the host header to build the base URL
    const host = req.headers["host"];
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
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

// Catch-all for API routes
app.all("/api/*", (req, res) => {
  res.status(404).json({ 
    error: "API endpoint not found", 
    path: req.url,
    method: req.method 
  });
});

export default app;
