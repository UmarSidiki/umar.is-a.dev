"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { onPageEnter } from "@/hooks/usePageReady";

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
 *
 * The hidden state is applied in the layout pass, before this component is ever
 * painted, and the tween is only created once the page is actually on screen —
 * so a reveal can never run visible → hidden → visible. `data-reveal` lets the
 * CSS guard hide the same nodes before hydration.
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

      const targets =
        self || el.children.length === 0 ? [el] : Array.from(el.children);

      if (targets[0] !== el) gsap.set(el, { opacity: 1 });
      gsap.set(targets, { y, autoAlpha: 0 });

      return onPageEnter(() => {
        gsap.to(targets, {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          delay,
          stagger,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} data-reveal="" className={className}>
      {children}
    </div>
  );
}
