// api/middleware.js
module.exports = (req, res, next) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Para solicitudes OPTIONS (pre-flight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Verificación de autenticación (opcional)
  const authHeader = req.headers.authorization;
  if (!authHeader && req.url.startsWith('/api/')) {
    return res.status(401).json({ error: 'Se requiere autenticación' });
  }
  
  // Validaciones específicas
  if (req.url.startsWith('/api/embassies/search')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const searchTerm = url.searchParams.get('term');
    if (!searchTerm) {
      return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
    }
  }
  
  // Log para monitoreo
  console.log(`${req.method} ${req.url}`);
  
  // Continuar con el siguiente middleware o función
  if (typeof next === 'function') {
    return next();
  }

};