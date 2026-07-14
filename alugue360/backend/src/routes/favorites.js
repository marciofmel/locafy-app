import { Router } from "express";
import { prisma } from "../server.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId },
      include: {
        listing: {
          include: { category: true, user: { select: { name: true, phone: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(favorites.map(f => f.listing));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar favoritos" });
  }
});

router.post("/:listingId", authMiddleware, async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.listingId } });
    if (!listing) return res.status(404).json({ error: "Anúncio não encontrado" });

    const existing = await prisma.favorite.findUnique({
      where: { userId_listingId: { userId: req.userId, listingId: req.params.listingId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.json({ favorited: false });
    }

    await prisma.favorite.create({
      data: { userId: req.userId, listingId: req.params.listingId },
    });

    res.json({ favorited: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao favoritar" });
  }
});

export default router;
