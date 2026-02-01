export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { audio } = req.body;

  if (!audio) {
    return res.status(400).json({ error: "No audio provided" });
  }

  // Dummy analysis response
  res.status(200).json({
    classification: "AI_GENERATED",
    confidence: "0.87",
    language: "English",
    explanation: "Demo response — audio processed successfully."
  });
}
