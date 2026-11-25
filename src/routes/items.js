import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { CATEGORIES, EDITABLE_FIELDS, validScale } from "../lib/validation.js";
import { loadItem } from "../middleware/loaders.js";

const router = Router();

// PATCH /items/:itemId — edit an item
router.patch("/:itemId", loadItem, async (req, res) => {
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

  const item = await prisma.item.update({ where: { id: req.item.id }, data });
  res.json(item);
});

// DELETE /items/:itemId — remove an item
router.delete("/:itemId", loadItem, async (req, res) => {
  await prisma.item.delete({ where: { id: req.item.id } });
  res.status(204).send();
});

// POST /items/:itemId/wear — record that it was worn today
router.post("/:itemId/wear", loadItem, async (req, res) => {
  const item = await prisma.item.update({
    where: { id: req.item.id },
    data: { lastWorn: new Date() },
  });
  res.json(item);
});

export default router;