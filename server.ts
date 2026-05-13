// server.ts
import express from "express";
import path from "path";
import dotenv from "dotenv";
import app from "./api/index";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

async function boot() {
  if (process.env.VERCEL) {
    console.log("Vercel environment detected, skipping server boot.");
    return;
  }
  
  const isDev = process.env.NODE_ENV !== "production";
  console.log(`Starting server in ${isDev ? 'development' : 'production'} mode...`);

  if (isDev) {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      // Vite middleware MUST be after API routes (handled in api/index.ts)
      // but api/index.ts exports 'app' which is already initialized.
      app.use(vite.middlewares);
      console.log("Vite middleware attached.");
    } catch (e: any) {
      console.error("Vite failed to load:", e.message);
    }
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static production assets configured.");
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`>>> Server running at http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  boot().catch(err => {
    console.error("Critical server startup error:", err);
  });
}

export default app;
