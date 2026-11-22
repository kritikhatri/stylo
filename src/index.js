import express from "express";
import "dotenv/config";
import { prisma } from "./lib/prisma.js"; 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: lets the server understand JSON data
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

// Start the server
app.listen(PORT, () => {
  console.log(`✨ Stylo server running on http://localhost:${PORT}`);
});