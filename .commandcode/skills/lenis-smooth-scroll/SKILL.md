---
name: lenis-smooth-scroll
description: Lenis smooth scrolling synced with GSAP ScrollTrigger in Next.js (setup, cleanup, reduced motion, modals/menus, admin exclusion). Use when touching smooth scroll, scroll-linked animation, scroll locks, or anchor scrolling.
license: MIT
---

# Lenis + GSAP ScrollTrigger

```tsx
'use client';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

useEffect(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || pathname.startsWith('/admin')) return;
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  lenisRef.current = lenis;            // expose via context for transitions / menus
  return () => { gsap.ticker.remove(tick); lenis.destroy(); lenisRef.current = null; };
}, [isAdmin, reduced]);
```
- Create ONE Lenis instance in a provider in the root layout; expose it via context. Never create Lenis per page.
- Do not smooth touch scrolling (`syncTouch: false`) — native momentum on phones feels right and avoids jank.
- Menus/modals: `lenis.stop()` on open, `lenis.start()` on close; add `data-lenis-prevent` to scrollable inner elements (modals, code blocks, admin tables).
- Route change: `lenis.scrollTo(0, { immediate: true, force: true })` then `ScrollTrigger.refresh()`.
- Anchor links: `lenis.scrollTo('#id', { offset: -headerHeight })`.
- `html.lenis, html.lenis body { height: auto; }` from lenis.css is required; don't set `scroll-behavior: smooth` on html at the same time.
