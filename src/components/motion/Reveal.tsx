"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  stagger?: number;
  /** Animate the wrapper itself instead of its direct children. */
  self?: boolean;
}

/**
 * Scroll-triggered reveal. Staggers direct children by default so groups of
 * elements cascade instead of fading in as one block.
 */
export default function Reveal({
  children,
  className,
  y = 26,
  delay = 0,
  stagger = 0.08,
  self = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const targets = self || el.children.length === 0 ? [el] : Array.from(el.children);

      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        delay,
        stagger,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
