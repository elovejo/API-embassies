# API de Embajadas

Esta API proporciona acceso a datos de embajadas ubicadas en Bogotá, Colombia. Almacenados en una base de datos PostgreSQL en Supabase. Está desplegada en Vercel y utiliza funciones serverless de Node.js.
(Datos obtenidos de https://www.embassypages.com/ciudad/bogota)
Hecho con ❤️ por elovejo.com

## Descripción

La API permite:

* Obtener una lista de todas las embajadas.
* Buscar embajadas por país, dirección o email usando el parámetro `term`.
* Filtrar embajadas por ciudad, país o tipo.

## Endpoints

* `GET /embassies`: Obtiene todas las embajadas.
* `GET /embassies/search?term=PAIS_O_DIRECCION_O_EMAIL`: Busca embajadas por país, dirección o email.
* `GET /embassies/search?city=CIUDAD&country=PAIS&type=TIPO`: Filtra embajadas por ciudad, país o tipo.

## Ejemplo de respuesta

```json
[
  {
    "city": "Bogotá",
    "embassies": [
      {
        "id": "4453986a-3271-4984-b9d4-8b1fe73985db",
        "country": {
          "name": "Germany",
          "alfa2": "DE"
        },
        "type": "Embassy",
        "contacts": [
          { "type": "address", "value": "Cra 11B #97-80, Bogotá" },
          { "type": "lat", "value": "4.6763" },
          { "type": "lng", "value": "-74.0488" },
          { "type": "phone", "value": "+57 1 1234567" },
          { "type": "email", "value": "info@germany-embajada.gov" }
        ]
      }
    ]
  }
]
```

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