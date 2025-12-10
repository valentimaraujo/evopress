import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './core/utils/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignora rotas públicas e estáticas
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('evopress_session')?.value;
  const isValid = token ? verifyToken(token) : null;

  // Se já está logado e tenta acessar login -> dashboard
  if (pathname === '/admin/login' && isValid) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Se não está logado e tenta acessar admin -> login
  if (pathname !== '/admin/login' && !isValid) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

