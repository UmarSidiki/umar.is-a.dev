import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, isSameOriginRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const noStore = { 'Cache-Control': 'no-store, must-revalidate' };

  // POST-only plus an Origin check, so no third-party page can log the admin out.
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403, headers: noStore }
    );
  }

  const response = NextResponse.json(
    { success: true, message: 'Logged out' },
    { headers: { 'Cache-Control': 'no-store, must-revalidate' } }
  );
  response.cookies.set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}
