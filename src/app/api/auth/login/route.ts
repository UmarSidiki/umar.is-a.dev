import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  getAdminConfig,
  getClientIp,
  isRateLimited,
  isSameOriginRequest,
  isSessionConfigured,
  rateLimitExceededResponse,
  recordRateLimitAttempt,
  resetRateLimit,
  signSessionToken,
  verifyAdminCredentials,
} from '@/lib/auth';

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILURES = 5;

export async function POST(request: NextRequest) {
  const noStore = { 'Cache-Control': 'no-store, must-revalidate' };

  // Login CSRF defense: if the browser sends an Origin header it must match
  // this deployment's own host, so a third-party page cannot silently log a
  // victim into an attacker-controlled account.
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403, headers: noStore }
    );
  }

  try {
    if (!isSessionConfigured() || !getAdminConfig()) {
      // Log the names of the missing settings only, never their values.
      console.error(
        'Login refused: authentication is not configured. Required env vars: ADMIN_USERNAME, ADMIN_PASSWORD_HASH (or ADMIN_PASSWORD_HASH_B64), JWT_SECRET (>=32 chars).'
      );
      return NextResponse.json(
        { success: false, error: 'Authentication is not configured on this server.' },
        { status: 500, headers: noStore }
      );
    }

    const ip = getClientIp(request);
    const rateKey = `login:${ip}`;
    if (isRateLimited(rateKey, LOGIN_MAX_FAILURES)) {
      return rateLimitExceededResponse();
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400, headers: noStore }
      );
    }

    const { username, password } = (body ?? {}) as Record<string, unknown>;

    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401, headers: noStore }
      );
    }

    if (username.length > 256 || password.length > 1024) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401, headers: noStore }
      );
    }

    const valid = await verifyAdminCredentials(username, password);

    if (!valid) {
      recordRateLimitAttempt(rateKey, LOGIN_WINDOW_MS);
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401, headers: noStore }
      );
    }

    const config = getAdminConfig();
    const token = config ? await signSessionToken({ username: config.username, role: 'admin' }) : null;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication is not configured on this server.' },
        { status: 500, headers: noStore }
      );
    }

    resetRateLimit(rateKey);

    const response = NextResponse.json(
      { success: true, message: 'Login successful' },
      { headers: noStore }
    );
    response.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } catch (error) {
    console.error('Login error:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: noStore }
    );
  }
}
