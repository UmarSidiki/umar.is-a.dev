import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, isSessionConfigured, verifySessionToken } from '@/lib/session';

// Next.js 16 renamed the "middleware" file convention to "proxy".
// Route handlers still verify the session themselves (defense in depth); this
// is a fast edge-level gate for admin APIs.
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Admin pages intentionally render the existing LoginForm for unauthenticated
  // visitors, so the page itself is not redirected here. All admin DATA is
  // guarded server-side by the API routes below (and by each route handler).
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const alwaysAdmin = ['/api/admin', '/api/analytics', '/api/upload', '/api/images'];
  const writeAdminOnly = ['/api/blog', '/api/projects'];

  const matchesPrefix = (prefix: string) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`);

  // Admin-only prefixes for every method.
  let requiresAdmin = alwaysAdmin.some(matchesPrefix);

  // Blog / projects: mutations are admin-only, GET reads are public.
  if (!requiresAdmin && writeAdminOnly.some(matchesPrefix) && MUTATING_METHODS.has(request.method)) {
    requiresAdmin = true;
  }

  // Comments: POST (public submission) and /api/comments/reactions (public)
  // stay public; only moderating an existing comment requires admin.
  if (!requiresAdmin && pathname === '/api/comments' && MUTATING_METHODS.has(request.method) && request.method !== 'POST') {
    requiresAdmin = true;
  }

  if (!requiresAdmin) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const user = isSessionConfigured() && token ? await verifySessionToken(token) : null;

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin access required' },
      { status: 401, headers: { 'Cache-Control': 'no-store, must-revalidate' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/analytics/:path*',
    '/api/upload/:path*',
    '/api/images/:path*',
    '/api/blog/:path*',
    '/api/projects/:path*',
    '/api/comments/:path*',
  ],
};
