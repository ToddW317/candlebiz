import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware to protect admin routes
export async function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  
  // Get the token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // Check if the path starts with /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If we're on the login page and have a token, redirect to admin dashboard
    if (isLoginPage && token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    // If we're not on the login page and don't have a token, redirect to login
    if (!isLoginPage && !token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure the paths that should be protected
export const config = {
  matcher: '/admin/:path*',
} 