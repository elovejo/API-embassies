import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export default async (req, res) => {
  console.log("req.query:", req.query);
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({ error: "Falta el ID de la embajada" });
    }

    const encodedId = encodeURIComponent(id); // Escapar caracteres especiales

    const response = await fetch(`https://zuztqqbnvridpzfdxldv.supabase.co/rest/v1/embassies?id=eq.${encodedId}`, {
      headers: {
        "apikey": process.env.SUPABASE_API_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_API_KEY}`,
      },
    });

    console.log("Response Status:", response.status); // Registro del estado de la respuesta

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error de Supabase:", errorText); // Registro del error de Supabase
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();

    console.log("Data from Supabase:", data); // Registro de los datos de Supabase

    if (data.length === 0) {
      return res.status(404).json({ error: "Embajada no encontrada" });
    }

    res.json(data[0]);
  } catch (error) {
    console.error("Error al obtener embajada:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};