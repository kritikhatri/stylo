import express from "express";
import "dotenv/config";
import { prisma } from "./lib/prisma.js";
import usersRouter from "./routes/users.js";
import itemsRouter from "./routes/items.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Settings and middleware
app.disable("x-powered-by");
app.use(express.json());

// Simple check routes
app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "Stylo" });
});

app.get("/db-check", async (req, res) => {
  const users = await prisma.user.count();
  const items = await prisma.item.count();
  res.json({ database: "connected", users, items });
});

// Route groups
app.use("/users", usersRouter);
app.use("/items", itemsRouter);

// These two MUST come after all routes
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✨ Stylo server running on http://localhost:${PORT}`);
});