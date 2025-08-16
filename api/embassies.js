import fetch from "node-fetch";

const BASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

async function fetchSupabase(endpoint, queryParams = {}) {
    const query = new URLSearchParams(queryParams);
    const url = `${BASE_URL}/rest/v1/${endpoint}?${query}`;

    const response = await fetch(url, {
        headers: {
            apikey: SUPABASE_API_KEY,
            Authorization: `Bearer ${SUPABASE_API_KEY}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw { status: response.status, message: errorText };
    }

    return await response.json();
}

export default async (req, res) => {
    try {
        const cityFilter = req.query.city?.toLowerCase();

        // Aquí solo consultamos la vista directamente
        const data = await fetchSupabase("embassies_nested");

        // Si quieres filtrar en Node (aunque podrías hacerlo con ?city=eq.xxx en la query):
        const filtered = cityFilter
            ? data.filter((d) => d.city.toLowerCase().includes(cityFilter))
            : data;

        res.status(200).json(filtered);
    } catch (error) {
        console.error("Error:", error.message || error);
        res.status(500).json({ error: "Error al consultar embassies_nested" });
    }
};
