import { NextResponse } from 'next/server';

const privateRoutes = ['/add-book', '/my-books', '/my-borrows', '/profile'];

const authRoutes = ['/sign-in', '/sign-up'];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Better Auth session cookie check
  const sessionCookie =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token');

  const isLoggedIn = !!sessionCookie;

  // Private routes protection
  const isPrivateRoute =
    privateRoutes.some(
      route => pathname === route || pathname.startsWith(`${route}/`),
    ) ||
    (pathname.startsWith('/books/') && pathname !== '/books');
  
  if (isPrivateRoute && !isLoggedIn) {
    const loginUrl = new URL('/sign-in', request.url);
    loginUrl.searchParams.set('callbackURL', pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Logged-in users cannot access login/register pages
  if (authRoutes.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/add-book/:path*',
    '/my-books/:path*',
    '/my-borrows/:path*',
    '/profile/:path*',
    '/books/:path*',
    '/sign-in',
    '/sign-up',
  ],
};
