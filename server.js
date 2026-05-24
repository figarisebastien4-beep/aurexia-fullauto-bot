import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json({ limit: "10mb" }));

// Vérification de la signature Shopify
function verifyShopify(req) {
  const hmac = req.headers["x-shopify-hmac-sha256"];
  const secret = process.env.SHOPIFY_API_SECRET;

  const body = JSON.stringify(req.body);
  const digest = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("base64");

  return digest === hmac;
}

// Route Webhook Shopify
app.post("/webhooks/products/update", (req, res) => {
  console.log("Webhook reçu :", req.body);

  if (!verifyShopify(req)) {
    console.log("❌ Signature Shopify invalide");
    return res.status(401).send("Unauthorized");
  }

  console.log("✔ Webhook Shopify validé");
  res.status(200).send("OK");
});

// Route test
app.get("/", (req, res) => {
  res.send("Aurexia SEO Bot — Serveur actif");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
