"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { isFinePointer, usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Refined custom cursor for desktop fine-pointer devices only.
 * Hidden for touch and reduced motion. Two layers: instant dot + trailing ring.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !isFinePointer()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });

    let visible = false;
    const onMove = (e: MouseEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element | null;
      const interactive = el?.closest?.(
        "a, button, [role='button'], input, textarea, select, [data-cursor]"
      );
      gsap.to(ring, {
        scale: interactive ? 2.1 : 1,
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(dot, { scale: interactive ? 0.4 : 1, duration: 0.35 });
    };

    const onDown = () => gsap.to(ring, { scale: 1.5, duration: 0.15 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.25 });

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf([dot, ring]);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[150] hidden md:block">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-8 w-8 rounded-full border border-signal"
        style={{ opacity: 0 }}
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-signal"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
