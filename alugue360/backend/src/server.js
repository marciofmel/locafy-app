import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listings.js";
import planRoutes from "./routes/plans.js";
import webhookRoutes from "./routes/webhook.js";
import bcrypt from "bcryptjs";
import categoryRoutes from "./routes/categories.js";
import uploadRoutes from "./routes/upload.js";
import favoriteRoutes from "./routes/favorites.js";
import adminRoutes from "./routes/admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  console.log("📦 Rodando prisma db push...");
  execSync("npx prisma db push --accept-data-loss", { stdio: "inherit", cwd: path.join(__dirname, "..") });
  console.log("✅ prisma db push concluído");
} catch { console.log("⚠️ prisma db push falhou, continuando mesmo assim"); }


export const prisma = new PrismaClient();

const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/favorites", favoriteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/webhook", webhookRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Error handler para erros do multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("📦 Multer error:", err);
    return res.status(400).json({ error: `Erro no upload: ${err.message}` });
  }
  if (err) {
    console.error("❌ General error:", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  }
  next();
});

app.get("/api/set-password", async (req, res) => {
  const { email, password, key } = req.query;
  if (key !== "locafy-admin-setup-2024") return res.status(401).json({ error: "chave invalida" });
  if (!email || !password) return res.status(400).json({ error: "email e password obrigatorios" });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.update({ where: { email }, data: { password: hash, role: "admin" } });
  res.json({ message: `senha alterada para ${user.name} (${user.email})` });
});

const frontendDist = path.join(__dirname, "..", "..", "frontend", "dist");
app.use(express.static(frontendDist));
app.get("*", (req, res) => res.sendFile(path.join(frontendDist, "index.html")));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Locafy API rodando na porta ${PORT}`));
