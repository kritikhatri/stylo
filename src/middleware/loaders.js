import { prisma } from "../lib/prisma.js";
import { parseId } from "../lib/validation.js";

// Finds the user from :userId, or sends 400/404
export async function loadUser(req, res, next) {
  const userId = parseId(req.params.userId);
  if (userId === null) {
    return res.status(400).json({ error: "userId must be a positive whole number" });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  req.user = user;
  next();
}

// Finds the item from :itemId, or sends 400/404
export async function loadItem(req, res, next) {
  const itemId = parseId(req.params.itemId);
  if (itemId === null) {
    return res.status(400).json({ error: "itemId must be a positive whole number" });
  }

  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }

  req.item = item;
  next();
}