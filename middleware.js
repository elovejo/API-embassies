// Archivo: middleware.js (en la raíz del proyecto)
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Verificar autenticación (ejemplo)
  const authHeader = request.headers.get('Authorization');
  if (!authHeader && request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'Se requiere autenticación' },
      { status: 401 }
    );
  }
  
  // Validación específica para la ruta de embajadas
  if (request.nextUrl.pathname.startsWith('/api/embassies/search')) {
    const searchTerm = request.nextUrl.searchParams.get('term');
    if (!searchTerm) {
      return NextResponse.json(
        { error: 'Se requiere un término de búsqueda' },
        { status: 400 }
      );
    }
  }

  // Para la ruta específica que busca por ID
  if (request.nextUrl.pathname.match(/^\/api\/embassies\/\d+$/)) {
    // Aquí podrías validar el formato del ID si es necesario
    const id = request.nextUrl.pathname.split('/').pop();
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }
  }

  // Logs para monitoreo (opcional)
  console.log(`Solicitud a ${request.nextUrl.pathname}`);

  // Permitir que la solicitud continúe
  return NextResponse.next();
}

// Configurar a qué rutas aplicar este middleware
export const config = {
  matcher: [
    '/api/:path*',  // Aplicar a todas las rutas API
  ],
};