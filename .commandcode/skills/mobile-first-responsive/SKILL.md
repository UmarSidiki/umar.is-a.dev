---
name: mobile-first-responsive
description: Mobile-first responsive layout, typography and interaction rules for this portfolio (Tailwind v4). Use for any layout, CSS, navigation, menu, typography, touch interaction, or responsive work, and before declaring any page done.
license: MIT
---

# Mobile-first responsive design

## Method
1. Write base (unprefixed) Tailwind classes for a 375–430px phone. Then layer `sm:` (640) `md:` (768) `lg:` (1024) `xl:` (1280) `2xl:` overrides. If you find yourself writing `max-*:` or hiding big desktop chunks on mobile, you are designing desktop-first — stop and restructure.
2. Design the phone composition deliberately: its own type scale, its own rhythm, its own hero crop. It is not the desktop grid collapsed into one column of cards.

## Typography
- Fluid display type with clamp: e.g. `font-size: clamp(3rem, 14vw, 13rem)` for the hero line; body `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)`, line-length 60–75ch max.
- Huge words on mobile must still fit at 360px: test the longest word; use `text-wrap: balance` for headings, `hyphens: auto` only for body, and `overflow-wrap: anywhere` as a last resort.
- Minimum 16px for inputs (prevents iOS zoom).

## Layout
- No horizontal overflow at 360px on any page: marquees, rotated/oversized type and 3D canvases sit inside `overflow-x: clip` wrappers (prefer `clip` over `hidden` so sticky still works). Use `100dvh`/`svh` instead of `100vh` for full-height sections.
- Respect safe areas: `padding-bottom: max(1rem, env(safe-area-inset-bottom))` for fixed bars.
- Grids: 4-col mobile / 8-col tablet / 12-col desktop editorial grid with intentional spans and offsets.

## Navigation & touch
- Mobile nav: a ≥44px menu button (aria-expanded, aria-controls, label) opening a full-screen animated menu with large stacked links (≥ 2rem type), the current page indicated, Esc and close button, focus trapped inside while open, focus returned to the toggle on close, body scroll locked (and Lenis stopped).
- All tap targets ≥ 44×44px (pad small icon buttons with an invisible hit area).
- Replace hover-only affordances on touch (`@media (hover: hover) and (pointer: fine)` gates hover effects, custom cursor and magnetic effects). On touch use press states (`:active` scale/opacity), visible always-on labels, and swipeable/scroll-snap carousels.
- No pinned scroll-jacking sequences longer than ~150vh on mobile; prefer simpler reveals via `gsap.matchMedia()`.

## Performance on phones
- Lighter 3D (fewer segments, DPR ≤ 1.25, no postprocessing) or a static poster.
- Avoid `backdrop-filter` on large areas and big box-shadows; animate only transform/opacity.

## Verify
- Check 360×800, 390×844, 768×1024, 1440×900. In devtools run: `document.documentElement.scrollWidth > innerWidth` must be false on every page.
