 export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      message: "AI Voice Analyzer API Ready",
    });
  }

  try {
    // Authentication
    const clientKey =
  req.headers["x-api-key"] ||
  req.headers["api-key"] ||
  req.headers["apikey"] ||
  req.headers["authorization"]?.replace("Bearer ", "") ||
  req.query?.api_key;

if (clientKey !== process.env.API_KEY) {
  return res.status(401).json({ error: "Invalid API key" });
}
    if (clientKey !== process.env.API_KEY) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    // Read raw audio buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    if (!buffer.length) {
      return res.status(400).json({ error: "No audio received" });
    }

    // Convert MP3 → Base64
    const base64Audio = buffer.toString("base64");

    const prompt = `
Analyze this audio and determine:

1. Classification: HUMAN or AI_GENERATED
2. Confidence score (0 to 1)
3. Spoken language
4. Short explanation

Return JSON only:
{
  "classification": "",
  "confidence": 0,
  "language": "",
  "explanation": ""
}
`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: "audio/mp3",
                    data: base64Audio,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await geminiResponse.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      result = {
        classification: "UNKNOWN",
        confidence: 0.5,
        language: "Unknown",
        explanation: text,
      };
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      error: "Analysis failed",
      details: err.message,
    });
  }
} 
     
                  
