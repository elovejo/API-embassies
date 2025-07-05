import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde .env

const app = express();
const port = 3000;

const BASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

// Función para obtener datos de Supabase
async function fetchSupabase(endpoint, queryParams = {}) {
    const query = new URLSearchParams(queryParams);
    const url = `${BASE_URL}/rest/v1/${endpoint}?${query}`;

    const response = await fetch(url, {
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

app.get("/api/embassies", async (req, res) => {
    try {
        const cityFilter = req.query.city?.toLowerCase();
        const countryFilter = req.query.country?.toLowerCase();
        const typeFilter = req.query.type?.toLowerCase();

        const [cities, embassies, countries, types, contacts, contactTypes] =
            await Promise.all([
                fetchSupabase("cities"),
                fetchSupabase("embassies"),
                fetchSupabase("countries"),
                fetchSupabase("embassy_types"),
                fetchSupabase("contacts"),
                fetchSupabase("contact_types"),
            ]);

        const getCountry = (id) => countries.find((c) => c.id === id);
        const getType = (id) => types.find((t) => t.id === id);
        const getContacts = (embassyId) => {
            const cons = contacts.filter((c) => c.embassy_id === embassyId);
            return cons.map((c) => ({
                type: contactTypes.find((ct) => ct.id === c.type_id)?.name || "unknown",
                value: c.value,
            }));
        };

        const result = cities
            .filter(city => !cityFilter || city.name.toLowerCase().includes(cityFilter))
            .map(city => {
                const cityEmbassies = embassies
                    .filter(e => e.city_id === city.id)
                    .filter(e => {
                        const country = getCountry(e.country_id);
                        const type = getType(e.type_id);
                        return (
                            (!countryFilter || country?.name.toLowerCase().includes(countryFilter)) &&
                            (!typeFilter || type?.name.toLowerCase() === typeFilter)
                        );
                    })
                    .map(e => ({
                        id: e.id,
                        country: {
                            name: getCountry(e.country_id)?.name || "Unknown",
                            alfa2: getCountry(e.country_id)?.alfa2 || "",
                        },
                        type: getType(e.type_id)?.name || "Unknown",
                        contacts: [
                            { type: "address", value: e.address },
                            { type: "lat", value: String(e.lat) },
                            { type: "lng", value: String(e.lng) },
                            ...getContacts(e.id),
                        ],
                    }));

                return {
                    city: city.name,
                    embassies: cityEmbassies,
                };
            })
            .filter(entry => entry.embassies.length > 0);

        res.json(result);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({
            error: "Error al construir JSON anidado con filtros",
        });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
