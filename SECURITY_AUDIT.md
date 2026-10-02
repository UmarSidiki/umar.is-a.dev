# Security Audit & Hardening Report

Repository: `next-portfolio` (Next.js 16 App Router + MongoDB, deployed on Vercel, public GitHub repo)
Branch audited: `fix/security-hardening`
Scope: source tree at HEAD **and full git history** (all branches/tags).

> Convention for this document: secrets are referred to by **name, type, file path and
> commit hash only**. No secret values are reproduced here.
>
> This is the second pass. Pass 1 introduced the auth/session rebase; this pass fixed a
> drafts regression, removed session-dependent public CDN caching, added CSRF checks to
> login/logout, repaired the ESLint setup, verified the secret scans, and corrected the
> rotation guidance below.

---

## 1. Secret inventory

### 1.1 Secrets found in the codebase (MUST rotate)

| # | What it is | Service | Files where it appears | Commit(s) introducing it | Still in HEAD at audit start? | Must rotate? |
|---|------------|---------|------------------------|--------------------------|-------------------------------|--------------|
| 1 | Hardcoded fallback JWT signing secret (plaintext string literal used when `JWT_SECRET` is unset) | Admin session/JWT signing | `src/app/api/auth/login/route.ts`, `src/app/api/auth/verify/route.ts`, `src/lib/auth.ts` | `613b48d` (2025-06-28) | Yes (removed in this change) | **YES** |
| 2 | Hardcoded bcrypt hash of a default admin password (well-known default, value not reproduced) | Admin login | `src/app/api/auth/login/route.ts` | `613b48d` (2025-06-28) | Yes (removed in this change) | **YES** |
| 3 | Hardcoded default admin username (default literal, value not reproduced) | Admin login | `src/app/api/auth/login/route.ts` | `613b48d` (2025-06-28) | Yes (removed in this change) | **YES** (set a non-default username) |

Why rotation is mandatory: the repository is public and history is retained. Even though
these values were removed from the working tree, they remain readable in git history, so
they must be treated as publicly known. Any deployment that ever ran with `JWT_SECRET`
unset was signing tokens with a publicly known key (token forgery), and any deployment
that ran without `ADMIN_PASSWORD_HASH` / `ADMIN_USERNAME` accepted the known default login.

> **Important:** the owner cannot know from here whether the Vercel project ever ran
> without `ADMIN_PASSWORD_HASH` and `JWT_SECRET` set. Treat both as compromised: set fresh
> values (new `JWT_SECRET`, new non-default `ADMIN_USERNAME`, new admin password hash).

### 1.2 Secret classes searched for and NOT found (tree or history)

Verified with the skill's masked recipes across **all branches/tags**, including files that
were added and later deleted (`git log --all --diff-filter=D --name-only`) and every
`.env*`, `*.json`, `*.yml` file ever committed:

- Committed `.env*` files — **none** were ever added (the only `env`-named file ever
  committed is `src/lib/env.ts`, an empty source file).
- `mongodb://` / `mongodb+srv://` URIs containing credentials — **none**.
- AWS / R2 / S3 access-key material (e.g. `AKIA…`) — **none**. The history hits for
  `accessKeyId` / `secretAccessKey` (`ef590d7`, `74b9e91`) are `process.env.CLOUDFLARE_R2_*`
  *references only* — no literal values.
- SMTP/email passwords (values) — **none**. The history hit (`5970fd4`) is
  `const { … SMTP_PASS } = process.env` and `pass: SMTP_PASS` — a reference only.
- Private keys (`BEGIN … PRIVATE KEY`) — **none**.
- Other API keys/tokens (`sk-…`, `ghp_…`, `github_pat_…`, `xox[baprs]-`, `AIza…`) — **none**.
- MongoDB credentials in a `MONGODB_URI` literal — **none**.

Environment-variable **names** referenced in history (names only, no values):
`JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (`613b48d`); `SMTP_PASS`
(`5970fd4`); `CLOUDFLARE_R2_SECRET_ACCESS_KEY` / `CLOUDFLARE_R2_ACCESS_KEY_ID`
(`ef590d7`, `74b9e91`).

**Consequence:** because R2, SMTP and MongoDB secret *values* never appeared in the repo or
history, they are **not** must-rotate items — see §1.4(b).

### 1.3 Public-but-not-secret identifiers (informational only)

- Cloudflare R2 public bucket hostname `pub-6b8bb26e6f904f9ea06505393acd8560.r2.dev`
  (`next.config.ts` `images.remotePatterns`).
- Cloudflare R2 public bucket hostname `pub-c84c7d98fbfc4fba9d6c5c4f9efeefb3.r2.dev`
  (`src/providers/user.ts`, `Resume` URL). Note: two different public bucket hostnames
  appear across the project — confirm which bucket is current and remove stale references.
- Personal contact details (name, email, phone, address) in `src/providers/user.ts` and
  `src/lib/seo.ts` — public by design.

### 1.4 Rotation checklist

#### (a) MUST rotate — publicly exposed in code / git history

| # | Env var to replace | Where to set it | Why |
|---|--------------------|-----------------|-----|
| 1 | `JWT_SECRET` | Vercel → Project → Settings → Environment Variables (Production **and** Preview) | The old fallback signing secret is in public history; tokens signed with it are forgeable. Generate: `openssl rand -base64 48` (≥ 32 chars; setting a new value invalidates all existing sessions). |
| 2 | `ADMIN_USERNAME` | Vercel env (Production + Preview) + local `.env.local` | The old default username is public history. Set a non-default value. |
| 3 | `ADMIN_PASSWORD_HASH` (or `ADMIN_PASSWORD_HASH_B64`) | Vercel env (Production + Preview) + local `.env.local` | The old default password hash is public history. Set a new password and store only its bcrypt hash (cost 12). Generate: `node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 12))" 'YOUR_NEW_PASSWORD'` |

Because history cannot be rewritten here, treat all three as compromised **regardless** of
the current code state. Existing admin sessions/tokens issued under the old scheme (and the
old localStorage tokens) become invalid and users must log in again.

#### (b) RECOMMENDED hygiene only — NOT found in the repo or history

These were searched for and not found (§1.2). Rotate **only if** the owner suspects
exposure elsewhere — e.g. a shared `.env` file, a screenshot, a pasted value, or a leaked
CI secret — not because of this repository:

- Cloudflare R2 access key/secret (`CLOUDFLARE_R2_ACCESS_KEY_ID` /
  `CLOUDFLARE_R2_SECRET_ACCESS_KEY`).
- SMTP password (`SMTP_PASS`).
- MongoDB database-user password (`MONGODB_URI`).

---

## 2. Deployment steps (do this after merging)

1. In Vercel → Project → Settings → Environment Variables, set **Production + Preview**:
   - `JWT_SECRET` — new value, ≥ 32 chars (`openssl rand -base64 48`).
   - `ADMIN_USERNAME` — new, non-default value.
   - `ADMIN_PASSWORD_HASH` **or** `ADMIN_PASSWORD_HASH_B64` — hash of the new password.
   - Confirm `MONGODB_URI` and (for R2/SMTP) the R2/SMTP vars are present.
2. Redeploy (promote the new deployment to Production).
3. Log in at `/admin` with the new credentials; confirm the dashboard lists drafts **and**
   published posts.
4. Verify old sessions are invalid: an old `admin_session` cookie (or a previously issued
   token) must be rejected by `/api/auth/verify` → 401.
5. Confirm public pages still render and that `/blog` shows only published posts.
6. Optional hygiene: rotate R2 / SMTP / MongoDB secrets per §1.4(b) if there is any
   suspicion of other exposure.

Notes:
- Existing admin sessions/tokens from the old localStorage scheme are **invalid after
  deploy** — everyone must log in again. `AuthContext` also removes the legacy
  `adminToken` / `admin_token` localStorage keys on load.
- In a local `.env` file escape `$` in bcrypt hashes as `\$`, or use the base64 variant.
  Values pasted into the Vercel dashboard are literal and need no escaping.

---

## 3. Route-by-route authorization matrix

Legend: **public** = no auth; **admin** = valid signed session cookie required (verified
server-side in the route handler, and also gated at the edge by `src/proxy.ts`);
**session** = reads the session cookie only.

| Route | Method | Access | Cache-Control | Notes |
|-------|--------|--------|---------------|-------|
| `/api/auth/login` | POST | public | `no-store` | Rate-limited (5 failed / 15 min / IP). **Origin-checked** (login CSRF). Sets httpOnly `admin_session`; token never in the body. |
| `/api/auth/verify` | GET | session | `no-store` | Reads the cookie; returns `{username, role}` or 401. |
| `/api/auth/logout` | POST | public | `no-store` | **POST-only + Origin-checked**; clears the cookie. |
| `/api/admin` | GET | admin | `no-store` | |
| `/api/analytics` | GET | admin | `private, no-store` | Dashboard stats. |
| `/api/blog` | GET | public / admin | **`private, no-store` (everyone)** | Public callers get published only; an authenticated admin with **no `status` param gets all posts (drafts + published)**. `no-store` because the same URL is session-dependent and the CDN does not key on cookies (also keeps newly published posts fresh). |
| `/api/blog` | POST / PUT / DELETE | admin | `private, no-store` | Create/update/delete posts (success and error responses). |
| `/api/blog/[slug]` | GET | public | `no-store` | Published posts only; never consults the session. |
| `/api/projects` | GET | public / admin (`?admin=true`) | public: `public, s-maxage=60, stale-while-revalidate=300`; admin: `private, no-store` | The **public URL and the `id` lookup never read the session**; the admin variant is a distinct URL (`?admin=true`) that returns 401 when unauthenticated. |
| `/api/projects` | POST / PUT / DELETE | admin | `private, no-store` | |
| `/api/comments` | GET | public (approved only) / admin (`?all=true`) | public listing: `public, s-maxage=60, …`; `?all=true`: `private, no-store` | Public listing **no longer consults the session** (same body for everyone); `email`/`ip` stripped. |
| `/api/comments` | POST | public | `private, no-store` | Rate-limited (5 / 10 min / IP); `status` forced to `pending`; primitives only; published-post only. |
| `/api/comments` | PUT / DELETE | admin | `private, no-store` | Approve/reject/delete. |
| `/api/comments/reactions` | POST | public | `private, no-store` | Rate-limited (30 / min / IP); approved comments only. |
| `/api/contact` | POST | public | `no-store` | Rate-limited (5 / hour / IP); HTML-escaped + header-injection-safe email. |
| `/api/contact` | GET | public | `no-store` | 405. |
| `/api/images` | GET / DELETE | admin | `private, no-store` | Object keys validated (no path traversal). |
| `/api/upload` | POST / DELETE | admin | `private, no-store` | MIME + magic-byte allowlist (jpeg/png/webp/gif/avif; SVG rejected); ≤ 10 MB; server-generated keys. |
| `/api/og` | GET | public | (edge image; error 500 `private, no-store`) | No session dependency. |
| `/blog/rss.xml` | GET | public | `no-store` | Published posts only. |
| `/admin` (pages) | — | public shell | — | Renders `LoginForm` until `/api/auth/verify` succeeds; all admin **data** is served only by the admin API routes above. |
| `/api/test-db` | — | **deleted** | — | Debug endpoint removed. |

### Cache-Control policy

`next.config.ts` no longer applies blanket public caching to `/api/*`. Each route sets it:

- Auth / admin / write endpoints: `private, no-store, must-revalidate`.
- **`/api/blog` GET: `private, no-store` for everyone** — the URL is session-dependent
  (drafts vs published) and Vercel's CDN does not vary on cookies, so it must never be
  cached.
- Genuinely session-independent public reads (`/api/projects` public variant,
  `/api/comments` public listing): `public, s-maxage=60, stale-while-revalidate=300`.
- Every 4xx/5xx and every auth/admin response is uncacheable.

---

## 4. Required environment variables

See `.env.example` for placeholders and generation commands.

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGODB_URI` | yes | MongoDB connection string. |
| `JWT_SECRET` | yes (≥ 32 chars) | Signs the admin session cookie (HS256). Login is refused if missing/short. |
| `ADMIN_USERNAME` | yes | Admin username. Login refused if missing. |
| `ADMIN_PASSWORD_HASH` | one of the two | bcrypt hash of the admin password. |
| `ADMIN_PASSWORD_HASH_B64` | one of the two | base64 of the bcrypt hash (avoids `$` escaping). Takes precedence if set. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL` | for contact form | SMTP credentials + destination. |
| `CLOUDFLARE_R2_ENDPOINT`, `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_R2_BUCKET_NAME`, `CLOUDFLARE_R2_PUBLIC_URL` | for uploads | R2 image storage. |
| `GOOGLE_SITE_VERIFICATION`, `BING_VERIFICATION`, `YANDEX_VERIFICATION` | optional | Search-engine verification (public identifiers). |

Fail-closed behaviour: if `JWT_SECRET` (or admin credentials) is missing, login returns a
generic 500 and **all** admin checks deny — there are no default credentials or default
signing secret in any environment.

---

## 5. Controls added

- **Auth**: cookie-based httpOnly `admin_session` (Secure in production, SameSite=Strict,
  Path=/, 8 h), signed HS256 with issuer/audience claims and explicit `algorithms: ['HS256']`
  on verify. No token in the response body; no localStorage/sessionStorage token usage.
- **Shared helper** `src/lib/auth.ts` (`getSession`, `requireAdmin`, rate limiting, Origin
  check, constant-time username comparison, always-run bcrypt comparison). Edge-safe
  signing/verification lives in `src/lib/session.ts` and is used by `src/proxy.ts`.
- **`src/proxy.ts`** (Next 16 renamed `middleware` → `proxy`) gates admin APIs at the edge;
  route handlers still verify themselves (defense in depth).
- **CSRF**: SameSite=Strict cookie + `Origin`-vs-host check on state-changing requests.
  The check compares the `Origin` **hostname** against `x-forwarded-host` (falling back to
  `host`), so custom domains and `*.vercel.app` both work. Applied to admin mutations,
  **`/api/auth/login`** (login CSRF) and **`/api/auth/logout`** (logout CSRF).
- **Cache correctness**: session-dependent GETs are `private, no-store`; the `/api/projects`
  admin variant is a distinct URL (`?admin=true`) with a 401 when unauthenticated; the
  `/api/comments` public listing no longer reads the session.
- **Input validation / NoSQL-injection hardening**: primitives only for comment fields,
  slug/ObjectId format validation, allowlisted reaction actions, server-forced `status`.
- **Uploads**: admin-only; MIME + extension + magic-byte allowlist; size cap; server-generated
  object keys; no path traversal.
- **Email**: user input HTML-escaped; CR/LF stripped from `Subject`/`Reply-To`/`To`; length caps.
- **Error hygiene**: internal error messages/stack details no longer returned to clients;
  all error responses uncacheable.

---

## 6. Verification (this pass)

Executed with DUMMY env values only, on `fix/security-hardening`:

| Check | Command | Result |
|-------|---------|--------|
| Typecheck | `npx tsc --noEmit` | **PASS** (exit 0) |
| Lint | `npm run lint` (= `eslint .`) | **Runs**; 4 errors + 1 warning, all pre-existing in untouched files (see §7) |
| Build | `JWT_SECRET=dummy… ADMIN_USERNAME=dummy ADMIN_PASSWORD_HASH=dummy-not-a-real-hash MONGODB_URI='mongodb://127.0.0.1:27017/dummy' npm run build` | **PASS** (exit 0) |
| Secret grep (tree, incl. untracked, excl. `.commandcode`) | grep for the old default JWT fallback string, the old default password, and bcrypt hashes (`\$2[aby]\$[0-9]{2}\$`) — patterns not reproduced here | **no matches** |
| Secret grep (history, all branches/tags, masked) | masking recipes from `reference/secret-scan.md` | only `613b48d` (see §1.1); R2/SMTP/Mongo are references only |
| `.commandcode` hygiene | `.commandcode/.gitignore` | local artifacts ignored; `AGENTS.md` + `skills/` committable |

The build logs show handled `MongoServerSelectionError` / `ECONNREFUSED` warnings while
prerendering `/sitemap.xml` (no reachable `MONGODB_URI` under dummy env). These are caught
by the sitemap generator and **do not fail the build**.

---

## 7. Known limitations / not fixed

- **Git history is not purged** (out of scope / no history rewrite permitted). The
  compromised default secret and password remain readable in history — this is why the
  §1.4(a) rotation is mandatory.
- **Rate limiting is best-effort**: in-memory per serverless instance (documented in
  `src/lib/auth.ts`). A durable limiter (e.g. Upstash/Redis or a Mongo counter) would be
  required for a hard guarantee.
- **`next/image` `dangerouslyAllowSVG: true`** in `next.config.ts` remains enabled
  (pre-existing). Uploads no longer accept SVG, but remote SVG via `/_next/image` is still
  allowed; the existing `contentSecurityPolicy` + `sandbox` mitigates script execution.
- **ESLint errors in files untouched by the security change** (not refactored, per scope —
  a fix would require behaviour/UI changes in unrelated components):
  - `src/components/BlogTTS.tsx` — 3 errors (`react-hooks/set-state-in-effect`) + 1 warning
    (`@typescript-eslint/no-unused-vars`).
  - `src/hooks/useTextToSpeech.ts` — 1 error (`react-hooks/immutability`: `loadVoices`
    accessed before it is declared).
  - **Total: 4 errors, 1 warning.** No errors in any security-touched file.
