# API de Embajadas

Esta API proporciona acceso a datos de embajadas ubicadas en Bogota, Colombia. Almacenados en una base de datos Supabase. Está desplegada en Vercel y utiliza funciones serverless de Node.js.
(Datos obtenidos de https://www.embassypages.com/ciudad/bogota)
Hecho con ❤️ por elovejo.com

## Descripción

La API permite:

* Obtener una lista de todas las embajadas.
* Buscar embajadas por término de búsqueda (país, dirección, email).
* Obtener los datos de una embajada específica por su ID.

## Endpoints

* `GET /api/embassies`: Obtiene todas las embajadas.
* `GET /api/embassies/search?term=TERMINO_DE_BUSQUEDA`: Busca embajadas por término.
* `GET /api/embassies/:id`: Obtiene una embajada por ID.

## Configuración

### Clonar el repositorio

```sh
   git clone https://github.com/elovejo/API-embassies.git
   cd api-embassies
```

### Instalar dependencias

```sh
   npm install
```

### Iniciar el servidor de desarrollo

```sh
   npm run dev
```

### Servidor local

```sh
   localhost:3000/api/embassies
```

### Variables de Entorno

* `SUPABASE_API_KEY`: Clave de API para acceder a la base de datos Supabase.

### vercel.json

El archivo `vercel.json` configura las rutas de la API:

```json
{
    "version": 2,
    "builds": [
        {
            "src": "api/*.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/api/embassies",
            "dest": "/api/embassies.js"
        },
        {
            "src": "/api/embassies/search",
            "dest": "/api/search.js"
        },
        {
            "src": "/api/embassies/(.*)",
            "dest": "/api/[id].js"
        }
    ]
}