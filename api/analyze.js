 export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API ready" });
  }

  try {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API key missing" });
    }

   const body = req.body || {};
   
   const audio =
  req.body.audio ||
  req.body.audio_base64 ||
  req.body.audioBase64;

    if (!audio) {
      return res.status(400).json({ error: "Audio not provided" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Analyze this audio and describe if it is AI generated or human." },
                {
                  inlineData: {
                    mimeType: "audio/wav",
                    data: audio,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    res.status(200).json({
      result: data,
    });
  } catch (err) {
    res.status(500).json({
      error: "Analysis failed",
      details: err.message,
    });
  }
}
