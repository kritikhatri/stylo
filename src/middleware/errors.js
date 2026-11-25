// Runs when no route matched the URL
export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Runs when something throws an error anywhere
export function errorHandler(err, req, res, next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body is not valid JSON" });
  }

  console.error(err);
  res.status(500).json({ error: "Something went wrong on our side" });
}