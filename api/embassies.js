import fetch from 'node-fetch';

export default async (req, res) => {
  try {
    const response = await fetch("https://zuztqqbnvridpzfdxldv.supabase.co/rest/v1/embassies_nested", {
      headers: {
        "apikey": process.env.SUPABASE_API_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        message: "Error fetching data from Supabase.",
        details: errorText
      });
    }

    const data = await response.json();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);

  } catch (error) {
    console.error("Error al obtener embajadas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
