import { Router } from "express";
import { prisma } from "../server.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();
router.use(adminAuth);

// Dashboard stats
router.get("/dashboard", async (req, res) => {
  try {
    const [
      users, listings, categories, plans, subscriptions, activeSubs,
      inactiveListings, featuredListings, usersWithListings, totalFavorites,
      usersByRole, listingsByCategory, plansBySubs, monthlyUsers, monthlyListings,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.category.count(),
      prisma.plan.count(),
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: "active" } }),
      prisma.listing.count({ where: { active: false } }),
      prisma.listing.count({ where: { featured: true } }),
      prisma.user.count({ where: { listings: { some: {} } } }),
      prisma.favorite.count(),
      prisma.user.groupBy({ by: ["role"], _count: true }),
      prisma.category.findMany({ select: { name: true, _count: { select: { listings: true } } }, orderBy: { listings: { _count: "desc" } } }),
      prisma.plan.findMany({ select: { id: true, name: true, price: true, _count: { select: { subscriptions: true } } }, orderBy: { price: "asc" } }),
      prisma.$queryRawUnsafe(`SELECT to_char("createdAt", 'YYYY-MM') as month, count(*)::int as count FROM "User" GROUP BY month ORDER BY month DESC LIMIT 12`),
      prisma.$queryRawUnsafe(`SELECT to_char("createdAt", 'YYYY-MM') as month, count(*)::int as count FROM "Listing" GROUP BY month ORDER BY month DESC LIMIT 12`),
    ]);
    const recentUsers = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, createdAt: true, role: true } });
    const recentListings = await prisma.listing.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { user: { select: { name: true } }, category: { select: { name: true } } } });
    res.json({
      stats: { totalUsers: users, totalListings: listings, totalCategories: categories, totalPlans: plans, totalSubscriptions: subscriptions, activeSubscriptions: activeSubs, inactiveListings, featuredListings, usersWithListings, totalFavorites },
      usersByRole,
      listingsByCategory,
      plansBySubs,
      monthlyUsers,
      monthlyListings,
      recentUsers,
      recentListings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Users
router.get("/users", async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const where = search ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] } : {};
    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, skip: (Number(page) - 1) * Number(limit), take: Number(limit), select: { id: true, name: true, email: true, phone: true, role: true, docStatus: true, createdAt: true, _count: { select: { listings: true } } } }),
    ]);
    res.json({ users, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { role, docStatus } = req.body;
    const data = {};
    if (role) data.role = role;
    if (docStatus) data.docStatus = docStatus;
    const user = await prisma.user.update({ where: { id: req.params.id }, data, select: { id: true, name: true, email: true, role: true, docStatus: true } });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listings
router.get("/listings", async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const where = search ? { title: { contains: search, mode: "insensitive" } } : {};
    const [total, listings] = await Promise.all([
      prisma.listing.count({ where }),
      prisma.listing.findMany({ where, orderBy: { createdAt: "desc" }, skip: (Number(page) - 1) * Number(limit), take: Number(limit), include: { user: { select: { name: true, email: true } }, category: { select: { name: true } } } }),
    ]);
    res.json({ listings, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/listings/:id", async (req, res) => {
  try {
    await prisma.listing.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Categories (full admin CRUD)
router.post("/categories", async (req, res) => {
  try {
    const { name, slug, icon, image } = req.body;
    if (!name || !slug) return res.status(400).json({ error: "name e slug são obrigatórios" });
    const cat = await prisma.category.create({ data: { name, slug, icon, image } });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/categories/:id", async (req, res) => {
  try {
    const { name, slug, icon, image } = req.body;
    const data = {};
    if (name) data.name = name;
    if (slug) data.slug = slug;
    if (icon !== undefined) data.icon = icon;
    if (image !== undefined) data.image = image;
    const cat = await prisma.category.update({ where: { id: req.params.id }, data });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Plans (full admin CRUD)
router.post("/plans", async (req, res) => {
  try {
    const { name, price, interval, maxListings, features, active, mpPlanId } = req.body;
    if (!name || price === undefined) return res.status(400).json({ error: "name e price são obrigatórios" });
    const plan = await prisma.plan.create({ data: { name, price: Number(price), interval: interval || "month", maxListings: maxListings || 2, features: features || [], active: active !== false, mpPlanId } });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/plans/:id", async (req, res) => {
  try {
    const { name, price, interval, maxListings, features, active, mpPlanId } = req.body;
    const data = {};
    if (name) data.name = name;
    if (price !== undefined) data.price = Number(price);
    if (interval) data.interval = interval;
    if (maxListings !== undefined) data.maxListings = maxListings;
    if (features) data.features = features;
    if (active !== undefined) data.active = active;
    if (mpPlanId !== undefined) data.mpPlanId = mpPlanId;
    const plan = await prisma.plan.update({ where: { id: req.params.id }, data });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/plans/:id", async (req, res) => {
  try {
    await prisma.plan.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
