import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { CATEGORIES, validScale } from "../lib/validation.js";
import { loadUser } from "../middleware/loaders.js";

const router = Router();

// POST /users — create a user
router.post("/", async (req, res) => {
  const { name, city } = req.body;
  if (!name || !city) {
    return res.status(400).json({ error: "name and city are required" });
  }

  const user = await prisma.user.create({ data: { name, city } });
  res.status(201).json(user);
});

// GET /users — list all users
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// POST /users/:userId/items — add an item to a wardrobe
router.post("/:userId/items", loadUser, async (req, res) => {
  const { name, category, colours, fabric, warmth, formality } = req.body;

  if (!name || !CATEGORIES.includes(category)) {
    return res.status(400).json({
      error: `name is required, and category must be one of: ${CATEGORIES.join(", ")}`,
    });
  }
  if (!validScale(warmth) || !validScale(formality)) {
    return res.status(400).json({ error: "warmth and formality must be whole numbers from 1 to 5" });
  }

  const item = await prisma.item.create({
    data: { name, category, colours: colours ?? [], fabric, warmth, formality, userId: req.user.id },
  });
  res.status(201).json(item);
});

// GET /users/:userId/items — view a wardrobe (optional ?category=top)
router.get("/:userId/items", loadUser, async (req, res) => {
  const where = { userId: req.user.id };

  if (req.query.category) {
    const category = req.query.category.toUpperCase();
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ error: `category must be one of: ${CATEGORIES.join(", ")}` });
    }
    where.category = category;
  }

  const items = await prisma.item.findMany({ where, orderBy: { createdAt: "desc" } });
  res.json(items);
});

export default router;