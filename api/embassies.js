import fetch from 'node-fetch';

export default async (req, res) => {
  console.log("req.query:", req.query);
  try {
    const response = await fetch("https://zuztqqbnvridpzfdxldv.supabase.co/rest/v1/embassies", {
      headers: {
        "apikey": process.env.SUPABASE_API_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener embajadas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
