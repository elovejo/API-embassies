import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde .env

const app = express();
const port = 3000;

const SUPABASE_URL = "https://zuztqqbnvridpzfdxldv.supabase.co/rest/v1/embassies";
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

// Función para obtener datos de Supabase
async function fetchSupabase(url, queryParams = {}) {
    const query = new URLSearchParams(queryParams);
    const fullUrl = query ? `${url}?${query}` : url;

    const response = await fetch(fullUrl, {
        headers: {
            "apikey": SUPABASE_API_KEY,
            "Authorization": `Bearer ${SUPABASE_API_KEY}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw { status: response.status, message: errorText };
    }

    return await response.json();
}

// Obtener todas las embajadas
app.get('/api/embassies', async (req, res) => {
    try {
        const data = await fetchSupabase(SUPABASE_URL);
        res.json(data);
    } catch (error) {
        console.error("Error al obtener embajadas:", error);
        res.status(error.status || 500).json({ error: error.message || "Error interno del servidor" });
    }
});

// Buscar embajadas por término
app.get('/api/embassies/search', async (req, res) => {
    try {
        const searchTerm = req.query.term?.toLowerCase();

        if (!searchTerm) {
            return res.status(400).json({ error: "Se requiere un término de búsqueda" });
        }

        const allEmbassies = await fetchSupabase(SUPABASE_URL);

        const filteredEmbassies = allEmbassies.filter(embassy =>
            embassy.country.toLowerCase().includes(searchTerm) ||
            embassy.address.toLowerCase().includes(searchTerm) ||
            embassy.email.toLowerCase().includes(searchTerm)
        );

        res.json(filteredEmbassies);
    } catch (error) {
        console.error("Error al buscar embajadas:", error);
        res.status(error.status || 500).json({ error: error.message || "Error interno del servidor" });
    }
});

// Obtener una embajada por ID
app.get('/api/embassies/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await fetchSupabase(SUPABASE_URL, { id: `eq.${id}` });

        if (data.length === 0) {
            return res.status(404).json({ error: "Embajada no encontrada" });
        }

        res.json(data[0]);
    } catch (error) {
        console.error("Error al obtener embajada:", error);
        res.status(error.status || 500).json({ error: error.message || "Error interno del servidor" });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});