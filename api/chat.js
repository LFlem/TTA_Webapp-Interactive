const BOT_SYSTEM = `Tu es l'assistant virtuel de TimeTravel Agency, une agence de voyage temporel de luxe (fictive).
Ton rôle : conseiller les clients sur les meilleures destinations temporelles.

Ton ton : professionnel mais chaleureux, passionné d'histoire, enthousiaste sans être familier. Tu réponds en français, de façon concise (2 à 5 phrases), en t'adaptant à la question.

Destinations proposées et tarifs (fictifs mais à respecter) :
- Paris 1889 — Belle Époque, Tour Eiffel, Exposition Universelle. 12 400 € / 5 jours. Idéal pour les amateurs d'élégance, d'architecture et d'histoire moderne.
- Crétacé -65M — dinosaures, nature préhistorique. 28 900 € / 3 jours. Pour aventuriers, amoureux de nature sauvage. Destination premium et encadrée.
- Florence 1504 — Renaissance, art, Michel-Ange, Léonard de Vinci. 15 200 € / 6 jours. Pour les passionnés d'art et de culture.

Tu peux suggérer une destination selon les intérêts du client, répondre aux questions de prix, de sécurité, de durée, et aux FAQ classiques d'une agence de voyage. Si une question sort du cadre, ramène avec tact vers les voyages temporels.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "MISTRAL_API_KEY is not configured" });
    return;
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages)) {
    res.status(400).json({ error: "Missing or invalid 'messages' field" });
    return;
  }

  try {
    const mistralRes = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        max_tokens: 1000,
        temperature: 0.6,
        messages: [{ role: "system", content: BOT_SYSTEM }, ...messages],
      }),
    });

    const data = await mistralRes.json();

    if (!mistralRes.ok) {
      res.status(mistralRes.status).json({ error: data.message || "Mistral API error" });
      return;
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || "";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
