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
        const countryFilter = req.query.country?.toLowerCase();
        const typeFilter = req.query.type?.toLowerCase();
        const term = req.query.term?.toLowerCase();

        // 🔹 Una sola llamada
        const cities = await fetchSupabase("embassies_nested");

        const result = cities
            .filter(
                (c) => !cityFilter || c.city.toLowerCase().includes(cityFilter)
            )
            .map((c) => {
                const embassies = c.embassies.filter((e) => {
                    const country = e.country?.name?.toLowerCase() || "";
                    const type = e.type?.toLowerCase() || "";
                    const address =
                        e.contacts
                            .find((ct) => ct.type === "address")
                            ?.value?.toLowerCase() || "";
                    const email =
                        e.contacts
                            .find((ct) => ct.type === "email")
                            ?.value?.toLowerCase() || "";

                    let matchesTerm = true;
                    if (term) {
                        matchesTerm =
                            country.includes(term) ||
                            address.includes(term) ||
                            email.includes(term);
                    }

                    return (
                        (!countryFilter || country.includes(countryFilter)) &&
                        (!typeFilter || type === typeFilter) &&
                        matchesTerm
                    );
                });

                return { city: c.city, embassies };
            })
            .filter((entry) => entry.embassies.length > 0);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error en búsqueda:", error.message || error);
        res.status(500).json({ error: "Error al buscar embajadas" });
    }
};
