import { NextResponse } from 'next/server';

export function middleware(request) {
  // Ejemplo: Reescritura de URL según una condición
  if (request.nextUrl.pathname.startsWith('/api/embassies')) {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.redirect(new URL('/error-page', request.url));
    }
  }

  // Retornar la respuesta por defecto si no hay cambios
  return NextResponse.next();
}

// Aplicar middleware a rutas específicas
export const config = {
  matcher: '/api/:path*', // Define a qué rutas aplicar este middleware
};
