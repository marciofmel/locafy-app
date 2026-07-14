import { Router } from "express";
import { prisma } from "../server.js";

const router = Router();

router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  res.json(categories);
});

export default router;
