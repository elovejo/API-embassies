import dotenv from "dotenv";

dotenv.config();

export default async (req, res) => {
  console.log("req.query:", req.query);

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Falta el ID de la embajada" });
    }

    const url = `https://zuztqqbnvridpzfdxldv.supabase.co/rest/v1/embassies?id=eq.${id}&limit=1`;

    const response = await fetch(url, {
      headers: {
        "apikey": process.env.SUPABASE_API_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error de Supabase:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log("Data from Supabase:", data);

    if (data.length === 0) {
      return res.status(404).json({ error: "Embajada no encontrada" });
    }

    res.setHeader("Access-Control-Allow-Origin", "*"); // Agregar CORS si es necesario
    res.json(data[0]);

  } catch (error) {
    console.error("Error al obtener embajada:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
