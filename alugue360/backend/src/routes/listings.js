import { Router } from "express";
import { prisma } from "../server.js";
import { authMiddleware } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/", async (req, res) => {
  const { category, search, city, state } = req.query;
  const where = { active: true };

  if (category) where.categoryId = category;
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (state) where.state = state;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const listings = await prisma.listing.findMany({
    where,
    include: { category: true, user: { select: { id: true, name: true, phone: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(listings);
});

router.get("/:id", async (req, res) => {
  const listing = await prisma.listing.findUnique({
    where: { id: req.params.id },
    include: { category: true, user: { select: { id: true, name: true, phone: true } } },
  });
  if (!listing) return res.status(404).json({ error: "Anúncio não encontrado" });

  let canContact = false;
  let requiredDoc = "rg";
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "locafy-secret-key-change-in-production");
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (user?.docStatus && user.docStatus !== "none") {
        const isVehicle = listing.category?.slug === "carros" || listing.category?.slug === "motos";
        requiredDoc = isVehicle ? "cnh" : "rg";
        if (isVehicle) canContact = !!(user.cnh && user.selfie);
        else canContact = !!(user.rgDocument && user.selfie);
      }
    }
  } catch {}

  res.json({ ...listing, canContact, requiredDoc });
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const sub = await prisma.subscription.findFirst({
      where: { userId: req.userId, status: "active" },
    });
    if (!sub) return res.status(403).json({ error: "Assinatura necessária para anunciar" });

    const { title, description, price, priceType, images, videos, whatsapp, street, number, neighborhood, city, state, categoryId, features } = req.body;
    const listing = await prisma.listing.create({
      data: { title, description, price, priceType: priceType || "daily", images, videos: videos || [], whatsapp, street, number, neighborhood, city, state, categoryId, features: features || [], userId: req.userId },
    });
    res.json(listing);
  } catch {
    res.status(500).json({ error: "Erro ao criar anúncio" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
  if (!listing || listing.userId !== req.userId) return res.status(403).json({ error: "Sem permissão" });

  const updated = await prisma.listing.update({ where: { id: req.params.id }, data: req.body });
  res.json(updated);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
  if (!listing || listing.userId !== req.userId) return res.status(403).json({ error: "Sem permissão" });

  await prisma.listing.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

router.get("/my/listings", authMiddleware, async (req, res) => {
  const listings = await prisma.listing.findMany({
    where: { userId: req.userId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(listings);
});

export default router;
