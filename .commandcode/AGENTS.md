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
10. **Keep security and design work separate.** Security/auth work must not restyle the UI (no layout, copy or className changes unless the auth flow strictly requires it). Design/UI work (see the design rules below) must not change auth, session, API security, caching headers or env handling. No unrelated refactors.
11. Don't leak internals to clients: no stack traces, raw error messages, env info, or DB names in API responses.
12. Validate all untrusted input (type, length, allowed values); reject objects where strings are expected (NoSQL operator injection); never let public callers set privileged fields.

For any security audit or auth/API work, load the `security-review` skill.

# Design & front-end rules (redesign)

Personal portfolio of Muhammad Umar Siddiqui (Full-Stack Web & Mobile App Developer, Sukkur, Pakistan). Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn-style UI primitives, MongoDB (projects, blog posts, comments), admin area. Deployed on Vercel.

## Hard boundaries (another engineer owns these, in parallel)
- Do NOT modify auth logic, API route security, session/cookie handling, or env/secret handling. Off-limits files for design work: `src/app/api/**`, `src/lib/auth.ts`, `src/lib/session.ts`, `src/lib/env.ts`, `src/lib/mongodb.ts`, `src/lib/email.ts`, `src/proxy.ts`, `src/contexts/AuthContext.tsx`, logic in `src/app/(pages)/admin/hooks/**`, and the `headers()` in `next.config.ts`. Admin auth uses an httpOnly cookie session: never read/write tokens in localStorage or add `Authorization` headers in client code.
- Admin/login: change markup, classNames and presentational components only. Never add an auth bypass, mock login, or hardcoded credential.
- Never write secrets, `.env*` files, or print environment variable values. Never run `git commit`/`git push`/change git config; leave changes in the working tree.
- Keep all real content and features. Never invent projects, clients, testimonials, awards, metrics or stats. Content sources: `src/providers/user.ts`, `src/lib/seo.ts`, and the APIs.

## Design direction
- Awwwards-level, bold and cohesive, NOT a template. Expressive display typography (next/font), a deliberate restrained palette with one sharp accent, editorial grid with intentional breaks, oversized indices/numerals, hairline rules, mono micro-labels, subtle grain, custom selection/focus styles.
- Banned clichés: purple/blue gradients, gradient text heroes, glassmorphism/backdrop-blur cards everywhere, emoji icons, centered stock hero, rounded-3xl shadow-card grids as the main idea, skill percentage bars.
- Public site: rich motion. Admin: same visual language but calm and utilitarian (light motion only, no smooth scroll, no cursor effects, no 3D).

## Mobile first (hard requirement)
- Base styles target 375–430px; enhance upward with `sm: md: lg: xl:`. Follow the `mobile-first-responsive` skill.
- No horizontal overflow at 360px; tap targets ≥ 44px; inputs ≥ 16px font; full-screen animated mobile menu; touch interactions instead of hover/cursor; lighter 3D on mobile.

## Code conventions
- App Router: server components by default; `"use client"` only where interactivity/animation is needed. Keep metadata, structured data, sitemap, RSS working.
- TypeScript strict-friendly, no `any` unless unavoidable. Tailwind for styling; shared tokens as CSS variables in `src/styles/globals.css` (`@theme`). Use `cn()` from `src/lib/utils.ts`.
- GSAP: register plugins once in a client module; always animate inside `useGSAP(() => {...}, { scope: ref, dependencies })` from `@gsap/react` so everything reverts on unmount; use `contextSafe` for event-handler animations; `gsap.matchMedia()` for responsive + reduced-motion variants; animate transform/opacity only. Follow the gsap-* skills.
- Lenis: single instance in a root provider, synced to ScrollTrigger via `gsap.ticker` (see `lenis-smooth-scroll`).
- 3D: React Three Fiber + drei, loaded with `next/dynamic({ ssr: false })`, DPR capped, paused off-screen, poster fallback for mobile-low-power / reduced motion / no WebGL (see `r3f-shaders-performance`).
- Page transitions: persistent shell + GSAP curtain, no React `<ViewTransition>` cross-fades (see `nextjs-page-transitions`).
- No `Math.random()`, `Date.now()`, `window`, or `localStorage` during render (hydration safety). No debug `console.log`.

## Accessibility & motion
- Semantic landmarks (header/nav/main/footer), one h1 per page, skip link, visible `:focus-visible` rings, keyboard-operable menus/modals (focus trap, Esc), `aria-*` on toggles, alt text, WCAG AA contrast (check accent on background).
- `prefers-reduced-motion: reduce`: no preloader, no smooth scroll, no pin/scrub (static layout), no curtain (instant swap), static 3D poster, no cursor follower.
- Content must exist in SSR HTML (no JS-only text); animations hide content only when JS is running (`html.js` class) and must always end visible (safety timeouts).

## Verification commands
- `MONGODB_URI=mongodb://127.0.0.1:27017/placeholder JWT_SECRET=placeholder-not-a-secret npm run build` must pass (Mongo connection errors without a DB are expected; pages must show designed empty/error states).
- `npx tsc --noEmit` and `npx eslint src --quiet` clean for touched files.
- If you run a server, use port 3100 and kill it when done.
