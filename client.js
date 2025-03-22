import { inject } from '@vercel/analytics';
inject();
// Este archivo reemplazaría tu código original del front-end

// Función para obtener todas las embajadas desde nuestra API
async function fetchEmbassies() {
    try {
        const response = await fetch("http://localhost:3000/api/embassies");

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        }

        const data = await response.json();
        renderEmbassies(data);
    } catch (error) {
        console.error("Error al obtener embajadas:", error);
    }
}

// Función para buscar embajadas por término
async function searchEmbassies(searchTerm) {
    try {
        const response = await fetch(`http://localhost:3000/api/embassies/search?term=${encodeURIComponent(searchTerm)}`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        }

        const data = await response.json();
        renderEmbassies(data);
    } catch (error) {
        console.error("Error al buscar embajadas:", error);
    }
}

// Función para obtener una embajada específica por ID
async function fetchEmbassyById(embassyId) {
    try {
        const response = await fetch(`/api/embassies/${embassyId}`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        }

        const embassy = await response.json();
        // Aquí puedes manejar la embajada individual, por ejemplo:
        renderSingleEmbassy(embassy);
    } catch (error) {
        console.error("Error al obtener embajada por ID:", error);
    }
}

// Función para mostrar los datos en la página
function renderEmbassies(embassies) {
    const container = document.getElementById("embassiesContainer");
    if (!container) {
        console.error("No se encontró el contenedor en el HTML");
        return;
    }

    container.innerHTML = ""; // Limpiar contenido previo
    embassies.forEach(embassy => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${embassy.country}</h3>
            <p><strong>Tipo:</strong> ${embassy.type}</p>
            <p><strong>Dirección:</strong> ${embassy.address}</p>
            <p><strong>Teléfono:</strong> ${embassy.phone}</p>
            <p><strong>Email:</strong> <a href="mailto:${embassy.email}">${embassy.email}</a></p>
            <p><strong>Website:</strong> <a href="${embassy.website}" target="_blank">${embassy.website}</a></p>
            <hr>
        `;
        container.appendChild(div);
    });
}

// Filtro en tiempo real con búsqueda en el servidor
document.getElementById("search").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    // Si el término de búsqueda está vacío, mostrar todas las embajadas
    if (searchTerm === "") {
        fetchEmbassies();
        return;
    }
    
    // Debounce para evitar muchas llamadas al servidor
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        searchEmbassies(searchTerm);
    }, 300);
});

// Cargar datos al iniciar
fetchEmbassies();