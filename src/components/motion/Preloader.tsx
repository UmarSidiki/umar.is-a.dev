"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { markPageReady } from "@/hooks/usePageReady";

const SESSION_KEY = "umar:intro-seen";

/**
 * Short first-load intro. Client-only overlay: the real page content is always
 * present in the SSR HTML underneath. Shown at most once per session, never for
 * reduced motion, and skipped on any click / key / scroll.
 */
export default function Preloader() {
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    const panel = panelRef.current;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    if (!panel) {
      setActive(false);
      return;
    }
    gsap.to(panel, {
      yPercent: -100,
      duration: 0.7,
      ease: "power4.inOut",
      onComplete: () => {
        setActive(false);
        markPageReady();
      },
    });
  }, []);

  useEffect(() => {
    if (reduced) {
      // The media query resolves after mount, possibly after this effect already
      // started the intro. Drop it outright rather than leaving it on screen.
      setActive(false);
      markPageReady();
      return;
    }
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = true;
    }
    if (seen) {
      markPageReady();
      return;
    }

    setActive(true);
    document.documentElement.style.overflow = "hidden";

    const counter = { value: 0 };
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(counter, {
      value: 100,
      duration: 1.25,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(counter.value));
        }
      },
    });

    const skip = () => finish();
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });
    window.addEventListener("touchstart", skip, { once: true, passive: true });

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
    };
  }, [reduced, finish]);

  useEffect(() => {
    if (!active) document.documentElement.style.overflow = "";
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[300] flex flex-col justify-between bg-background px-6 py-8 sm:px-10"
      onClick={finish}
      role="presentation"
    >
      <div ref={panelRef} className="absolute inset-0 -z-10 bg-background" />
      <div className="label-mono text-ink-soft">
        Portfolio / {new Date().getFullYear()}
      </div>
      <div className="flex items-end justify-between gap-6">
        <h1 className="display-hero max-w-[12ch] text-foreground">
          Umar Siddiqui
        </h1>
        <div className="label-mono flex items-baseline gap-1 text-ink-soft">
          <span ref={counterRef} className="text-2xl text-foreground">
            0
          </span>
          <span>/ 100</span>
        </div>
      </div>
    </div>
  );
}
