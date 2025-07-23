# API de Embajadas

Esta API proporciona acceso a datos de embajadas ubicadas en Bogotá, Colombia. Almacenados en una base de datos PostgreSQL en Supabase. Está desplegada en Vercel y utiliza funciones serverless de Node.js.
(Datos obtenidos de https://www.embassypages.com/ciudad/bogota)
Hecho con ❤️ por elovejo.com

## Descripción

La API permite:

* Obtener una lista de todas las embajadas.
* Buscar embajadas por término de búsqueda (país, dirección, email) usando el parámetro `term`.

## Endpoints

* `GET /embassies`: Obtiene todas las embajadas.
* `GET /embassies/search?term=TERMINO_DE_BUSQUEDA`: Busca embajadas por país, dirección o email.
* También puedes filtrar por `city`, `country` o `type`.

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
   localhost:3000/embassies
```

### Variables de Entorno

* `SUPABASE_API_KEY`: Clave de API para acceder a la base de datos Supabase.
* `SUPABASE_URL`: URL de tu instancia de Supabase.

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
            "src": "/embassies",
            "dest": "/api/embassies.js"
        },
        {
            "src": "/embassies/search",
            "dest": "/api/search.js"
        }
    ]
}
```