"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "./SmoothScrollProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { armPageGate, markPageReady } from "@/hooks/usePageReady";

gsap.registerPlugin(ScrollTrigger);

/* One property system only: clip-path. The panel is a full-viewport sheet that
   is clipped away below the fold while parked, opens upward to cover, then is
   clipped away above the fold to reveal — one continuous sweep. Using clip-path
   instead of a transform means there is no inline translateY for GSAP to parse
   into `y` and then stack `yPercent` on top of, which is what left the old
   curtain stranded on screen. */
const PARKED = "inset(100% 0% 0% 0%)";
const COVERED = "inset(0% 0% 0% 0%)";
const RELEASED = "inset(0% 0% 100% 0%)";

const COVER_DUR = 0.5;
const LEAVE_DUR = 0.6;
/** If the router never reports a new pathname, the page is still revealed. */
const SAFETY_MS = 2600;
/** Last-resort guard so entrance animations can never be locked out. */
const GATE_FALLBACK_MS = 3500;

function isInternalLink(
  anchor: HTMLAnchorElement,
  href: string | null
): href is string {
  if (!href) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  if (anchor.dataset.noTransition !== undefined) return false;
  if (
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  )
    return false;
  if (!href.startsWith("/")) return false;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  // Same path (query/hash only) — let Next handle it normally.
  if (url.pathname === window.location.pathname) return false;
  return true;
}

/**
 * Flicker-free page transition.
 *
 * Click → curtain fully covers → router.push → new pathname commits → scroll to
 * top → ScrollTrigger.refresh → curtain leaves → the reveal gate opens, so the new
 * page's entrance animations start only once it is actually visible. Every way
 * out (push error, no route change, back/forward, reduced motion, timeout) ends
 * with the curtain parked off screen and the page visible.
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
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const safetyRef = useRef<number | null>(null);
  /** idle → covering → covered (push issued, waiting on the new pathname). */
  const phaseRef = useRef<"idle" | "covering" | "covered">("idle");

  const park = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    gsap.set(panel, { clipPath: PARKED, autoAlpha: 0, pointerEvents: "none" });
    gsap.set(labelRef.current, { clearProps: "all" });
  }, []);

  /** End the transition by fiat: page visible, gate open. Idempotent. */
  const finish = useCallback(() => {
    if (safetyRef.current !== null) {
      window.clearTimeout(safetyRef.current);
      safetyRef.current = null;
    }
    tlRef.current?.kill();
    tlRef.current = null;
    phaseRef.current = "idle";
    park();
    markPageReady();
  }, [park]);

  // Park the curtain before anything can paint over it. The reveal gate is
  // handed over by the preloader when its intro ends; this timeout covers every
  // other case so a page can never stay un-animated.
  useEffect(() => {
    park();
    // Every mounted reveal has applied its own inline hidden state by now (they
    // run in the layout pass), so the pre-paint CSS guard can step aside.
    document.documentElement.classList.remove("reveal-guard");
    const fallback = window.setTimeout(markPageReady, GATE_FALLBACK_MS);
    return () => window.clearTimeout(fallback);
  }, [park]);

  // A committed route change: reset scroll, refresh, then let the curtain leave.
  useEffect(() => {
    if (phaseRef.current !== "covered") {
      // Back/forward, or a navigation we did not start. Never strand the curtain.
      if (phaseRef.current !== "idle") finish();
      return;
    }
    phaseRef.current = "idle";

    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    const panel = panelRef.current;
    if (!panel || reduced) {
      finish();
      return;
    }

    tlRef.current = gsap
      .timeline({
        defaults: { ease: "power4.inOut" },
        delay: 0.06,
        onComplete: () => {
          tlRef.current = null;
          park();
          markPageReady();
        },
      })
      .to(labelRef.current, { autoAlpha: 0, duration: 0.22, ease: "power2.in" }, 0)
      .to(panel, { clipPath: RELEASED, duration: LEAVE_DUR }, 0.04);
  }, [pathname, lenis, reduced, park, finish]);

  // Intercept internal navigations.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as Element | null;
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!isInternalLink(anchor, href)) return;

      e.preventDefault();
      e.stopPropagation();

      if (phaseRef.current !== "idle") return;

      const panel = panelRef.current;
      if (reduced || !panel) {
        // Instant swap, no curtain.
        armPageGate();
        router.push(href);
        window.setTimeout(markPageReady, 0);
        return;
      }

      phaseRef.current = "covering";
      armPageGate();

      const commit = () => {
        phaseRef.current = "covered";
        safetyRef.current = window.setTimeout(() => {
          safetyRef.current = null;
          finish();
        }, SAFETY_MS);
        try {
          router.push(href);
        } catch {
          finish();
        }
      };

      tlRef.current = gsap
        .timeline({
          defaults: { ease: "power4.inOut" },
          onComplete: () => {
            tlRef.current = null;
            commit();
          },
        })
        .set(panel, { clipPath: PARKED, autoAlpha: 1, pointerEvents: "auto" }, 0)
        .to(panel, { clipPath: COVERED, duration: COVER_DUR }, 0)
        .fromTo(
          labelRef.current,
          { autoAlpha: 0, yPercent: 45 },
          { autoAlpha: 1, yPercent: 0, duration: 0.32, ease: "power3.out" },
          0.18
        );
    };

    const prefetched = new Set<string>();
    const prefetchFrom = (e: Event) => {
      const target = e.target as Element | null;
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!isInternalLink(anchor, href)) return;
      if (prefetched.has(href)) return;
      prefetched.add(href);
      router.prefetch(href);
    };

    const onPopState = () => {
      if (phaseRef.current !== "idle") finish();
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("pointerover", prefetchFrom, true);
    document.addEventListener("touchstart", prefetchFrom, {
      passive: true,
      capture: true,
    });
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerover", prefetchFrom, true);
      document.removeEventListener("touchstart", prefetchFrom, true);
      window.removeEventListener("popstate", onPopState);
      if (safetyRef.current !== null) window.clearTimeout(safetyRef.current);
      tlRef.current?.kill();
    };
  }, [router, reduced, finish]);

  return (
    <>
      {children}
      <div
        ref={panelRef}
        aria-hidden="true"
        className="fixed inset-0 z-[200] flex items-center justify-center bg-signal text-signal-ink"
        style={{ visibility: "hidden", clipPath: PARKED }}
      >
        <div ref={labelRef} className="label-mono">
          Umar Siddiqui — Portfolio
        </div>
      </div>
    </>
  );
}
