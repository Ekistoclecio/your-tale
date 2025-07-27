import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_ROUTES = ['/sign-in', '/sign-up'];

export async function authMiddleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  if (!token && !PUBLIC_ROUTES.includes(pathname) && !pathname.startsWith('/api/auth')) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return null;
}
