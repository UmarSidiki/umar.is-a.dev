---
name: security-review
description: Security audit and hardening playbook for this Next.js App Router + MongoDB app — secret scanning (tree and full git history, values masked), cookie-session auth with middleware/proxy, per-route API auth checklist, rate limiting, upload safety, and OWASP basics. Use whenever touching auth, API routes, env/secrets, uploads, or doing a security review.
---

# Security review playbook

Work through these phases in order. Keep a written inventory as you go. Never print secret values — names, types, files, commit hashes only.

## 1. Secret scanning (tree + full history)

Follow `reference/secret-scan.md`. Summary:
- List every file ever committed that looks like env/credential material: `git log --all --format= --name-only --diff-filter=A | sort -u | grep -iE '(^|/)\.env|secret|cred|key|\.pem|\.p12|id_rsa|serviceaccount'`.
- Search history by pattern WITHOUT printing values: `git log --all -E -G'<regex>' --format='%h %ad %s' --date=short --name-only`.
- Search the tree: `git grep -nE '<regex>' | sed -E 's/[A-Za-z0-9+\/=_.$-]{12,}/<MASKED>/g'`.
- For each hit record: what it is, provider/service, files, first/last commit, still in HEAD?, must rotate? (anything ever committed to a public repo must be rotated — removal from HEAD is not enough).
- Hardcoded defaults (default admin passwords, their hashes, default JWT secrets) count as secrets: they are publicly known, so any deployment that relied on them is compromised.

## 2. Env handling

- One place reads env (`src/lib/env.ts` or the auth helper). Required secrets have no fallback. Missing → fail closed.
- Session secret: require length ≥ 32; document `openssl rand -base64 48`.
- Admin password: store only a bcrypt hash (cost ≥ 10/12). Document generation: `node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 12))" 'your-password'`. Note `$` characters in local `.env` files need escaping (`\$`) because Next.js expands `$VAR`; Vercel dashboard values are literal.
- `.gitignore`: `.env*` plus `!.env.example`. `.env.example` has names + fake placeholders only.

## 3. Auth pattern (Next.js App Router)

See `reference/nextjs-auth.md` for code-level guidance. Requirements:
- Login route: validate types; constant-time username compare (`crypto.timingSafeEqual` over SHA-256 digests); ALWAYS run `bcrypt.compare` (against a dummy hash if username wrong) to avoid timing enumeration; generic "Invalid credentials".
- Rate limit login per IP (first entry of `x-forwarded-for`, else `x-real-ip`); e.g. 5 failures / 15 min → 429 with `Retry-After`. In-memory is best-effort per serverless instance — say so in a comment.
- Session: signed JWT (HS256, explicit `algorithms`, `iss`/`aud`, `exp` 8–12h) in an httpOnly cookie; `secure` in production; `sameSite: 'strict'` (or `'lax'`); `path: '/'`. Never return the token in JSON or store it in localStorage.
- Logout: POST, clears the cookie (maxAge 0), `no-store`.
- Verify/me route: reads cookie, returns minimal user info, `no-store`.
- Shared helper `requireAdmin(request)` used by every admin route handler; returns a 401 `NextResponse` (or null user) — never throws raw errors to the client.
- CSRF: for POST/PUT/PATCH/DELETE on admin routes, require `Origin` (or `Referer`) host == request host.
- Middleware/proxy: Next 16 renamed `middleware.ts` → `proxy.ts` (verify against `node_modules/next`). It may run on the edge: use `jose`, not `jsonwebtoken`. It's defense in depth only — route handlers verify themselves.
- Client: `AuthContext` calls `/api/auth/verify` with `credentials: 'same-origin'`; remove all `Authorization: Bearer` headers and localStorage token code; `localStorage.removeItem` old token keys once.

## 4. API route checklist

Use `reference/api-checklist.md` for every file under `src/app/api/**`. Produce a matrix: route + method → public read / public write (rate-limited, validated) / admin-only.

## 5. OWASP basics to check

- A01 Broken access control: every admin route enforced server-side; public GETs don't return drafts, unapproved comments, emails, IPs, contact messages.
- A02 Crypto failures: no weak/default secrets; explicit JWT alg; bcrypt for passwords.
- A03 Injection: NoSQL operator injection (reject non-strings / objects, never spread `request.json()` into queries or updates; whitelist fields); escape user data in HTML emails; strip CR/LF from email header values; no `dangerouslySetInnerHTML`/`rehype-raw` on user-authored content.
- A04 Insecure design: debug endpoints (e.g. `/api/test-db`) removed or admin-only.
- A05 Misconfiguration: no `Access-Control-Allow-Origin: *` on credentialed/write routes; security headers present; `Cache-Control` not public on auth/admin/error responses; no verbose errors.
- A07 Auth failures: rate limiting, generic errors, session expiry, logout.
- A08/A10: uploads — admin only, MIME + extension allowlist (jpeg/png/webp/gif/avif; no SVG unless sanitized), size cap, server-generated object keys, no path traversal; no server-side fetching of user-supplied URLs (SSRF).

## 6. Verify

- `npx tsc --noEmit`, lint, and `npm run build` with DUMMY env values only.
- `git grep -nE "process\.env\.[A-Z_]+ *(\|\||\?\?) *['\"]|\\\$2[aby]\\\$[0-9]{2}\\\$|mongodb(\+srv)?://[^/]*:[^/]*@|AKIA[0-9A-Z]{16}"` returns nothing security-relevant (no env fallbacks for secrets, no bcrypt hashes, no credentialed URIs, no access keys). Never write known default passwords or old secret strings into patterns, docs or commits — search for them locally from history instead.
- `git diff` review: no secret values, no design changes, no leftover debug logging of credentials.
- Report: inventory (no values), env var list with generation commands, route matrix, unfixed items.
