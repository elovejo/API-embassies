export default async (req, res) => {
  console.log("Método:", req.method);
  console.log("req.query:", req.query);
  console.log("req.url:", req.url);

  let id = req.query.id; // Primero intentamos obtenerlo de la query

  // Si no hay id en la query, lo buscamos en la URL
  if (!id) {
    const urlParts = req.url.split("/");
    id = urlParts[urlParts.length - 1]; // Extraemos el último segmento de la URL
  }

  if (!id || id.includes("?")) { // Evitar casos donde el ID esté mal formado
    return res.status(400).json({ error: "Falta el ID de la embajada" });
  }

  const encodedId = encodeURIComponent(id);

  try {
    const response = await fetch(`https://zuztqqbnvridpzfdxldv.supabase.co/rest/v1/embassies?id=eq.${encodedId}`, {
      headers: {
        "apikey": process.env.SUPABASE_API_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error de Supabase:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();

    if (data.length === 0) {
      return res.status(404).json({ error: "Embajada no encontrada" });
    }

    res.json(data[0]);
  } catch (error) {
    console.error("Error al obtener embajada:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
