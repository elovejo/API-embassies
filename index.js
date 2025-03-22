// Archivo: server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Verificar que existe la API key
if (!process.env.SUPABASE_API_KEY) {
  console.error("Error: SUPABASE_API_KEY no está definida en el archivo .env");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para obtener todas las embajadas
app.get('/api/embassies', async (req, res) => {
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
      console.error(`Error en Supabase: ${response.status}, ${errorText}`);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener embajadas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para buscar embajadas por país
app.get('/api/embassies/search', async (req, res) => {
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
    // Filtrar en el servidor
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
});

// Ruta para obtener una embajada específica por ID
app.get('/api/embassies/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    const response = await fetch(`https://zuztqqbnvridpzfdxldv.supabase.co/rest/v1/embassies?id=eq.${id}`, {
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
    
    if (data.length === 0) {
      return res.status(404).json({ error: "Embajada no encontrada" });
    }
    
    res.json(data[0]);
  } catch (error) {
    console.error("Error al obtener embajada:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});