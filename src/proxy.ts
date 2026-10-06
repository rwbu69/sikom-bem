import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'sikom-rahasia-super-aman-123'
);

export default async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  
  const isAuthPage = pathname.startsWith('/login');
  const isAdminRoute = pathname.startsWith('/admin');
  const isProfilRoute = pathname.startsWith('/profil');
  const isProtectedPath = isAdminRoute || isProfilRoute;
  const isChangePasswordPath = pathname === '/profil/keamanan';

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;
      const isDefaultPassword = payload.isDefaultPassword as boolean;
      
      // Force change password
      if (isDefaultPassword === true && !isChangePasswordPath) {
        return NextResponse.redirect(new URL('/profil/keamanan', request.url));
      }

      if (isAuthPage) {
        return NextResponse.redirect(new URL(role === 'ADMIN' ? '/admin' : '/profil', request.url));
      }

      if (isAdminRoute && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/profil', request.url));
      }
      
      return NextResponse.next();
    } catch (error) {
      if (isProtectedPath) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
      }
    }
  } else {
    if (isProtectedPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)'],
};
