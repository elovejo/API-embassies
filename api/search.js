const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const searchTerm = req.query.term?.toLowerCase();
    
    if (!searchTerm) {
      return res.status(400).json({ error: "Se requiere un término de búsqueda" });
    }

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

    const allEmbassies = await response.json();
    const filteredEmbassies = allEmbassies.filter(embassy => 
      embassy.country.toLowerCase().includes(searchTerm) ||
      embassy.address.toLowerCase().includes(searchTerm) ||
      embassy.email.toLowerCase().includes(searchTerm)
    );
    
    res.json(filteredEmbassies);
  } catch (error) {
    console.error("Error al buscar embajadas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
