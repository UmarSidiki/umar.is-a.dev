# Project memory: umar.is-a.dev portfolio

Next.js 16 (App Router, `src/`), React 19, MongoDB (`src/lib/mongodb.ts`), Cloudflare R2 via `@aws-sdk/client-s3`, deployed on Vercel.
This repository is PUBLIC on GitHub. Assume every line of code, every commit, and every file ever committed is readable by attackers.

Commands: `npm ci`, `npm run build`, `npx tsc --noEmit`, `npx eslint .` (or `npm run lint`).

## Security rules (non-negotiable)

1. **Never hardcode secrets.** No passwords, password hashes, API keys, access keys, JWT/session secrets, tokens, or connection strings with credentials in source, config, tests, docs, or fixtures. Read them from `process.env` only. Document new env vars by NAME in `.env.example` with obviously fake placeholders.
2. **No insecure fallbacks.** Never write `process.env.X || 'some-default'` for anything security-relevant (secrets, admin credentials, allowed origins). No default admin user/password in any environment.
3. **Fail closed.** If a required secret/credential is missing or invalid, deny: refuse login, return 401/403/500 with a generic message, log the *name* of the missing variable server-side (never its value).
4. **Server-side auth enforcement.** Every admin page's data and every write/admin API route must verify the session on the server in the route handler itself (via the shared helper in `src/lib/auth.ts` / `src/lib/session.ts`). Middleware/proxy is an extra layer, never the only check. Client-side checks are UX only.
5. **Sessions live in httpOnly cookies** (Secure in production, SameSite=Strict/Lax, Path=/, short expiry, signed with an env secret, explicit algorithm on verify). Never put session tokens in localStorage/sessionStorage or JSON response bodies.
6. **State-changing admin requests** must pass an Origin/Host check (CSRF defense) in addition to SameSite cookies.
7. **Authenticated or per-user responses are `Cache-Control: private, no-store`.** Never let the CDN cache auth, admin, or error responses.
8. **No secret values in output, commits, or logs.** When scanning code or git history for secrets, mask values (e.g. pipe through `sed -E 's/[A-Za-z0-9+\/=_.$-]{12,}/<MASKED>/g'` or use `git log -G... --name-only`). Report secrets by name, type, file and commit only. Never read or print the process environment (`env`, `printenv`, `echo $SECRET`).
9. **Never rewrite git history, commit, or push** unless explicitly asked. Edit the working tree only.
10. **Don't change the visual design.** No restyling, layout, copy or className changes unless the auth flow strictly requires a UI change (e.g. login form, logout button behaviour). No unrelated refactors.
11. Don't leak internals to clients: no stack traces, raw error messages, env info, or DB names in API responses.
12. Validate all untrusted input (type, length, allowed values); reject objects where strings are expected (NoSQL operator injection); never let public callers set privileged fields.

For any security audit or auth/API work, load the `security-review` skill.
