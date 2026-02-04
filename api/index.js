export default function handler(req, res) {
  const apiKey = req.headers["x-api-key"] || req.query.key;

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  res.status(200).json({ message: "API working!" });
}
