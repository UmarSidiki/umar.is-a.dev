# Next.js App Router cookie-session auth (reference)

## Cookie
name: e.g. `admin_session` (prefix `__Host-` in production is ideal: requires Secure, Path=/, no Domain)
options: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 60*60*8 }
Set with `response.cookies.set(name, token, options)`; clear with `maxAge: 0`.
Read in route handlers with `request.cookies.get(name)?.value` (or `cookies()` from `next/headers`, which is async in Next 15+/16: `const store = await cookies()`).

## Token
jose (edge + node): `new SignJWT({ role: 'admin', sub: username }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setIssuer(ISS).setAudience(AUD).setExpirationTime('8h').sign(key)`
verify: `jwtVerify(token, key, { algorithms: ['HS256'], issuer: ISS, audience: AUD })`
key: `new TextEncoder().encode(secret)`; refuse if secret missing or < 32 chars.

## Shared helper shape
```ts
export async function requireAdmin(req: NextRequest): Promise<{ user: AdminUser } | { response: NextResponse }>
```
- read cookie → verify → role === 'admin' → for unsafe methods check Origin host == Host/X-Forwarded-Host → return user
- else return `{ response: NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'private, no-store' } }) }`

## proxy.ts / middleware.ts (Next 16: proxy.ts, export function `proxy`; check node_modules/next for the exact convention)
- matcher: ['/admin/:path*', '/api/admin/:path*', ...]
- verify cookie with jose; for API routes return 401 JSON when invalid; for pages either allow (page renders LoginForm) or redirect.
- Defense in depth only. Route handlers must call requireAdmin themselves.

## Client
- `fetch('/api/auth/login', { method: 'POST', credentials: 'same-origin', ... })` → server sets cookie.
- `AuthContext` checks `/api/auth/verify` on mount; `logout()` POSTs `/api/auth/logout`.
- No token in state/localStorage; no Authorization headers.
