import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "locafy-secret-key-change-in-production";

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }
  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}
