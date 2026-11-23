import express from "express";
import "dotenv/config";
import { prisma } from "./lib/prisma.js";

const app = express();
const PORT = process.env.PORT || 3000;
const CATEGORIES = ["TOP", "BOTTOM", "DRESS", "LAYER", "SHOES", "ACCESSORY"];
const validScale = (n) => Number.isInteger(n) && n >= 1 && n <= 5;
const EDITABLE_FIELDS = ["name", "category", "colours", "fabric", "warmth", "formality", "imageUrl", "inLaundry"];

app.use(express.json());

// Route: health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "Stylo" });
});
// Route: check the database connection
app.get("/db-check", async (req, res) => {
  const users = await prisma.user.count();
  const items = await prisma.item.count();
  res.json({ database: "connected", users, items });
});
// Route: create a user
app.post("/users", async (req, res) => {
  const { name, city } = req.body;

  if (!name || !city) {
    return res.status(400).json({ error: "name and city are required" });
  }

  const user = await prisma.user.create({
    data: { name, city },
  });

  res.status(201).json(user);
});

// Route: list all users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
// Route: add an item to a user's wardrobe
app.post("/users/:userId/items", async (req, res) => {
  const userId = Number(req.params.userId);
  const { name, category, colours, fabric, warmth, formality } = req.body;

  if (!Number.isInteger(userId)) {
    return res.status(400).json({ error: "userId must be a number" });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!name || !CATEGORIES.includes(category)) {
    return res.status(400).json({
      error: `name is required, and category must be one of: ${CATEGORIES.join(", ")}`,
    });
  }

  
  if (!validScale(warmth) || !validScale(formality)) {
    return res.status(400).json({ error: "warmth and formality must be whole numbers from 1 to 5" });
  }

  const item = await prisma.item.create({
    data: { name, category, colours: colours ?? [], fabric, warmth, formality, userId },
  });

  res.status(201).json(item);
});

// Route: get a user's wardrobe (optionally filtered by category)
app.get("/users/:userId/items", async (req, res) => {
  const userId = Number(req.params.userId);
  const where = { userId };

  if (req.query.category) {
    const category = req.query.category.toUpperCase();
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ error: `category must be one of: ${CATEGORIES.join(", ")}` });
    }
    where.category = category;
  }

  const items = await prisma.item.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  res.json(items);
});
// Route: edit an item (only the fields sent are changed)
app.patch("/items/:itemId", async (req, res) => {
  const itemId = Number(req.params.itemId);
  if (!Number.isInteger(itemId)) {
    return res.status(400).json({ error: "itemId must be a number" });
  }

  const existing = await prisma.item.findUnique({ where: { id: itemId } });
  if (!existing) {
    return res.status(404).json({ error: "Item not found" });
  }

  // Copy only allowed fields from the request
  const data = {};
  for (const field of EDITABLE_FIELDS) {
    if (req.body[field] !== undefined) {
      data[field] = req.body[field];
    }
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: `Send at least one of: ${EDITABLE_FIELDS.join(", ")}` });
  }
  if (data.category !== undefined && !CATEGORIES.includes(data.category)) {
    return res.status(400).json({ error: `category must be one of: ${CATEGORIES.join(", ")}` });
  }
  if (data.warmth !== undefined && !validScale(data.warmth)) {
    return res.status(400).json({ error: "warmth must be a whole number from 1 to 5" });
  }
  if (data.formality !== undefined && !validScale(data.formality)) {
    return res.status(400).json({ error: "formality must be a whole number from 1 to 5" });
  }
  if (data.inLaundry !== undefined && typeof data.inLaundry !== "boolean") {
    return res.status(400).json({ error: "inLaundry must be true or false" });
  }

  const item = await prisma.item.update({
    where: { id: itemId },
    data,
  });

  res.json(item);
});

// Route: delete an item
app.delete("/items/:itemId", async (req, res) => {
  const itemId = Number(req.params.itemId);
  if (!Number.isInteger(itemId)) {
    return res.status(400).json({ error: "itemId must be a number" });
  }

  const existing = await prisma.item.findUnique({ where: { id: itemId } });
  if (!existing) {
    return res.status(404).json({ error: "Item not found" });
  }

  await prisma.item.delete({ where: { id: itemId } });
  res.status(204).send();
});

// Route: record that an item was worn today
app.post("/items/:itemId/wear", async (req, res) => {
  const itemId = Number(req.params.itemId);
  if (!Number.isInteger(itemId)) {
    return res.status(400).json({ error: "itemId must be a number" });
  }

  const existing = await prisma.item.findUnique({ where: { id: itemId } });
  if (!existing) {
    return res.status(404).json({ error: "Item not found" });
  }

  const item = await prisma.item.update({
    where: { id: itemId },
    data: { lastWorn: new Date() },
  });

  res.json(item);
});
// Start the server
app.listen(PORT, () => {
  console.log(`✨ Stylo server running on http://localhost:${PORT}`);
});