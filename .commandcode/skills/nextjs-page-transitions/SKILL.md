---
name: nextjs-page-transitions
description: Flicker-free page transitions in the Next.js App Router with GSAP (curtain/overlay pattern), persistent layout, scroll reset and Lenis/ScrollTrigger refresh. Use when working on route changes, navigation animation, view transitions, template.tsx, or any flicker/flash between pages.
license: MIT
---

# Flicker-free page transitions (Next.js App Router)

## Why transitions flicker (diagnose these first)
- React `<ViewTransition>` / `experimental.viewTransition` / CSS `::view-transition-*` cross-fading full-page snapshots while the new page is still loading client data → old and new pages overlap/ghost, then content pops in.
- `template.tsx` or per-page wrappers that remount header/background/canvas on every navigation → flashes and lost state.
- Client pages that render empty then fetch in `useEffect` → the "new page" is blank for a frame, then jumps.
- Animating the incoming page from `opacity:0` in `useGSAP` without setting the initial state in CSS → one frame of fully visible content before the tween starts (FOUC). Use `autoAlpha` + an initial CSS class, or `gsap.set` inside `useLayoutEffect`/useGSAP before paint.
- Theme class applied after hydration (next-themes without `suppressHydrationWarning`/`disableTransitionOnChange`) → color flash.
- Scroll restoration fighting smooth scroll → jump.

## Recommended pattern: persistent shell + curtain
- Root layout renders Header, Footer, Cursor, Lenis provider, the transition overlay and (if global) the WebGL canvas once. Pages only render their `<main>` content. Do not use `template.tsx` for the animated wrapper.
- A `TransitionProvider` (client) exposes `navigate(href)` and a `<TransitionLink>` that wraps `next/link`:
  - Ignore modified clicks (meta/ctrl/shift/alt, middle button), `target="_blank"`, external URLs, hash-only links, and same-path links (scroll to top instead).
  - `e.preventDefault()`; `router.prefetch(href)`; play curtain IN (overlay `yPercent: 100 → 0`, ~0.5–0.6s, `power4.inOut`); then `router.push(href, { scroll: false })`.
  - In an effect keyed on `usePathname()` (+ `useSearchParams` if needed): when the new pathname commits, `lenis.scrollTo(0, { immediate: true, force: true })` (or `window.scrollTo(0,0)`), `ScrollTrigger.refresh()`, wait one rAF (and `document.fonts.ready` the first time), then play curtain OUT (`yPercent: 0 → -100`) and fire a `page:enter` event so page-level reveals start only after the curtain leaves.
  - Safety timeout (e.g. 4s) that always reveals the page if navigation fails; also handle back/forward (popstate → no curtain or a quick fade, but always scroll/refresh correctly).
- The overlay is `position: fixed; inset: 0; z-index: high; pointer-events: none` when idle and rendered in the server HTML in its "hidden" state (no hydration flash). Put brand mark/next page label on it for character.
- Page-level enter animations: initial hidden state in CSS (e.g. `[data-reveal] { visibility: hidden }` only when JS is on: add `html.js` class via an inline script in `<head>`), reveal via `gsap.to(…, { autoAlpha: 1 })` inside useGSAP. With `prefers-reduced-motion`, skip the curtain (instant swap) and reveals.
- Kill/revert all page ScrollTriggers on unmount (useGSAP does this when you create them inside its scope) before the new page creates its own; call `ScrollTrigger.refresh()` after new content (images/fonts) settles.

## Data
- Prefer server components / server fetching so the new page HTML is complete when it commits. If a page must fetch on the client, render a designed skeleton with the final dimensions to avoid layout jumps.

## Verify
- Record frames while navigating (Playwright CDP screencast): there must be no frame with both pages overlapping, no blank/unstyled frame, no frame where the new page shows before being hidden, and scrollY must be 0 after navigation. Back/forward must work. Only one `<main>` in the DOM at any time.
