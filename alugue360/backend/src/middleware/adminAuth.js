import jwt from "jsonwebtoken";
import { prisma } from "../server.js";

const JWT_SECRET = process.env.JWT_SECRET || "locafy-secret-key-change-in-production";

export async function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }
  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Acesso restrito a administradores" });
    }
    req.userId = user.id;
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}
