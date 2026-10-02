import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import {
  SESSION_COOKIE,
  type AuthenticatedUser,
  isSessionConfigured,
  verifySessionToken,
} from './session';

export type { AuthenticatedUser };
export { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, isSessionConfigured, signSessionToken } from './session';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// ---------------------------------------------------------------------------
// Admin credentials (env-only, fail closed)
// ---------------------------------------------------------------------------

export interface AdminConfig {
  username: string;
  passwordHash: string;
}

export function getAdminConfig(): AdminConfig | null {
  const username = process.env.ADMIN_USERNAME;
  let passwordHash = process.env.ADMIN_PASSWORD_HASH;

  const base64Hash = process.env.ADMIN_PASSWORD_HASH_B64;
  if (base64Hash) {
    try {
      passwordHash = Buffer.from(base64Hash, 'base64').toString('utf8').trim();
    } catch {
      passwordHash = undefined;
    }
  }

  if (!username || !username.trim() || !passwordHash || !passwordHash.trim()) {
    return null;
  }

  return { username: username.trim(), passwordHash: passwordHash.trim() };
}

function constantTimeEqual(a: string, b: string): boolean {
  const aHash = crypto.createHash('sha256').update(a, 'utf8').digest();
  const bHash = crypto.createHash('sha256').update(b, 'utf8').digest();
  return crypto.timingSafeEqual(aHash, bHash);
}

/**
 * Verify admin credentials. The bcrypt comparison always runs (even when the
 * username is wrong) so response timing does not reveal user enumeration.
 */
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const config = getAdminConfig();
  if (!config) {
    return false;
  }

  const usernameMatches = constantTimeEqual(username, config.username);

  let passwordMatches = false;
  try {
    passwordMatches = await bcrypt.compare(password, config.passwordHash);
  } catch {
    passwordMatches = false;
  }

  return usernameMatches && passwordMatches;
}

// ---------------------------------------------------------------------------
// Session helpers
// ---------------------------------------------------------------------------

export async function getSession(request: NextRequest): Promise<AuthenticatedUser | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return verifySessionToken(token);
}

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Unauthorized: Admin access required' },
    { status: 401, headers: { 'Cache-Control': 'no-store, must-revalidate' } }
  );
}

export function forbiddenResponse(): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Forbidden' },
    { status: 403, headers: { 'Cache-Control': 'no-store, must-revalidate' } }
  );
}

export type AdminAuthResult =
  | { ok: true; user: AuthenticatedUser }
  | { ok: false; response: NextResponse };

/**
 * Server-side admin guard. Verifies the signed session cookie and, for
 * state-changing requests, checks the Origin header against the request host
 * (CSRF defense in depth on top of the SameSite cookie).
 */
export async function requireAdmin(request: NextRequest): Promise<AdminAuthResult> {
  if (!isSessionConfigured()) {
    return { ok: false, response: unauthorizedResponse() };
  }

  if (MUTATING_METHODS.has(request.method) && !isSameOriginRequest(request)) {
    return { ok: false, response: forbiddenResponse() };
  }

  const user = await getSession(request);
  if (!user) {
    return { ok: false, response: unauthorizedResponse() };
  }

  return { ok: true, user };
}

// ---------------------------------------------------------------------------
// CSRF origin check
// ---------------------------------------------------------------------------

function hostFromHeader(value: string | null): string | null {
  if (!value) return null;
  // Strip any port so host/forwarded-host comparisons are stable.
  return value.split(',')[0].trim().split(':')[0].toLowerCase();
}

export function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) {
    // Same-origin navigations/fetches may omit Origin; the SameSite=Strict
    // session cookie is the primary CSRF control in that case.
    return true;
  }

  let originHost: string;
  try {
    originHost = new URL(origin).hostname.toLowerCase();
  } catch {
    return false;
  }

  const requestHost =
    hostFromHeader(request.headers.get('x-forwarded-host')) ||
    hostFromHeader(request.headers.get('host'));

  if (!requestHost) {
    return false;
  }

  return originHost === requestHost;
}

// ---------------------------------------------------------------------------
// Best-effort in-memory rate limiting
//
// NOTE: This state lives in a single serverless instance. On Vercel each
// instance has its own memory, so this is a best-effort speed bump, not a
// hard guarantee. It complements (never replaces) the credential checks.
// ---------------------------------------------------------------------------

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();

function pruneExpired(now: number): void {
  if (rateBuckets.size < 5000) return;
  for (const [key, bucket] of rateBuckets) {
    if (bucket.resetAt <= now) {
      rateBuckets.delete(key);
    }
  }
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

export function isRateLimited(key: string, limit: number): boolean {
  const now = Date.now();
  pruneExpired(now);
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    return false;
  }
  return bucket.count >= limit;
}

export function recordRateLimitAttempt(key: string, windowMs: number): void {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  bucket.count += 1;
}

export function resetRateLimit(key: string): void {
  rateBuckets.delete(key);
}

export function rateLimitExceededResponse(): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Too many requests. Please try again later.' },
    { status: 429, headers: { 'Cache-Control': 'no-store, must-revalidate' } }
  );
}
