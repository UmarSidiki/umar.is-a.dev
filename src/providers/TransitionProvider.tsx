"use client";

import React, { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "./SmoothScrollProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Flicker-free page transition.
 *
 * A single signal-coloured curtain is the only thing that moves. On an internal
 * link click we: prevent Next's own handler (capture phase), animate the curtain
 * up over the viewport, then router.push. When the new pathname commits we reset
 * scroll, refresh ScrollTrigger and animate the curtain away. The layout,
 * header, cursor and canvas live in the root layout and never remount, so no
 * flash of old/unstyled content and no scroll jump.
 */
export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { lenis } = useLenis();
  const reduced = usePrefersReducedMotion();

  const panelRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const pending = useRef(false);

  // Park the curtain off-screen.
  useEffect(() => {
    if (panelRef.current) {
      gsap.set(panelRef.current, { yPercent: 100, pointerEvents: "none" });
    }
  }, []);

  // React to a committed route change: reset scroll, refresh, reveal.
  useEffect(() => {
    const wasPending = pending.current;
    pending.current = false;

    // Only forward navigations start at the top. Back/forward should restore
    // the previous scroll position (handled natively / by scrollRestoration).
    if (wasPending) {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    }

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    const panel = panelRef.current;
    if (!wasPending || !panel) {
      return () => cancelAnimationFrame(raf);
    }

    if (reduced) {
      gsap.set(panel, { yPercent: 100, pointerEvents: "none" });
      animating.current = false;
      return () => cancelAnimationFrame(raf);
    }

    gsap
      .timeline({
        onComplete: () => {
          gsap.set(panel, { pointerEvents: "none" });
          animating.current = false;
        },
      })
      .to(labelRef.current, { autoAlpha: 0, duration: 0.25 }, 0)
      .to(panel, { yPercent: -100, duration: 0.6, ease: "power4.inOut" }, 0.05);

    return () => cancelAnimationFrame(raf);
  }, [pathname, lenis, reduced]);

  // Intercept internal navigations.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as Element | null;
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.dataset.noTransition !== undefined) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }
      if (!href.startsWith("/")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same path (query/hash only) — let the router handle it normally.
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      e.stopPropagation();

      if (animating.current) return;

      const panel = panelRef.current;
      if (reduced || !panel) {
        router.push(href);
        return;
      }

      animating.current = true;
      pending.current = true;

      gsap
        .timeline()
        .set(panel, { pointerEvents: "auto", yPercent: 100 })
        .to(panel, { yPercent: 0, duration: 0.55, ease: "power4.inOut" })
        .fromTo(
          labelRef.current,
          { autoAlpha: 0, yPercent: 60 },
          { autoAlpha: 1, yPercent: 0, duration: 0.35, ease: "power3.out" },
          0.15
        )
        .add(() => router.push(href));
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, reduced]);

  return (
    <>
      {children}
      <div
        ref={panelRef}
        aria-hidden="true"
        className="fixed inset-0 z-[200] flex items-center justify-center bg-signal text-signal-ink"
        style={{ transform: "translateY(100%)" }}
      >
        <div ref={labelRef} className="label-mono opacity-0">
          Umar Siddiqui — Portfolio
        </div>
      </div>
    </>
  );
}
