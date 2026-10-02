import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'admin_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours
export const SESSION_ISSUER = 'portfolio';
export const SESSION_AUDIENCE = 'portfolio-admin';

export interface AuthenticatedUser {
  username: string;
  role: 'admin';
}

function getSecretKey(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    return null;
  }
  return new TextEncoder().encode(secret);
}

export function isSessionConfigured(): boolean {
  return getSecretKey() !== null;
}

export async function signSessionToken(user: AuthenticatedUser): Promise<string | null> {
  const key = getSecretKey();
  if (!key) {
    return null;
  }
  return new SignJWT({ role: user.role, username: user.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setSubject(user.username)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<AuthenticatedUser | null> {
  const key = getSecretKey();
  if (!key || !token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    if (payload.role !== 'admin') {
      return null;
    }
    const username = typeof payload.username === 'string' ? payload.username : payload.sub;
    if (!username) {
      return null;
    }
    return { username, role: 'admin' };
  } catch {
    return null;
  }
}
