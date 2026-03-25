import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";
import dotenv from "dotenv";

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

async function startServer() {
  console.log("Starting server with NODE_ENV:", process.env.NODE_ENV);
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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

  apiRouter.get("/get-client-ip", (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    res.json({ ip: Array.isArray(ip) ? ip[0] : ip });
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
        // Default to single unlock
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

  app.use("/api", apiRouter);

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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
