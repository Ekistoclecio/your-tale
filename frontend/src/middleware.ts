import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from './lib/middlewares/auth';

export async function middleware(req: NextRequest) {
  const authResponse = await authMiddleware(req);

  if (authResponse) {
    return authResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\..*).*)'],
};
