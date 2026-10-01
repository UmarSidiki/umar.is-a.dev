"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { onPageEnter } from "@/hooks/usePageReady";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

interface SplitRevealProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  delay?: number;
  stagger?: number;
  /** "scroll" animates in on enter; "load" plays immediately. */
  trigger?: "scroll" | "load";
  /** Per-line masking, or per-character rise for display type. */
  split?: "lines" | "chars";
}

/**
 * Masked text reveal using GSAP SplitText. Content is always in the DOM and
 * visible without JS; the lines are pushed behind their mask during the mount
 * (layout) pass — before anything is painted — and only rise once the page is
 * actually on screen, so the headline can never flash visible → hidden →
 * visible behind the curtain. `data-reveal` covers the pre-hydration window.
 */
export default function SplitReveal({
  children,
  className,
  as = "h2",
  delay = 0,
  stagger = 0.07,
  trigger = "scroll",
  split = "lines",
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const instance = new SplitText(el, {
        type: split === "chars" ? "lines,chars" : "lines",
        mask: "lines",
        linesClass: "pb-[0.12em]",
      });

      const targets =
        split === "chars" && instance.chars.length > 0
          ? instance.chars
          : instance.lines;

      gsap.set(targets, { yPercent: 115 });

      const off = onPageEnter(() => {
        gsap.set(el, { opacity: 1 });
        gsap.to(targets, {
          yPercent: 0,
          duration: split === "chars" ? 0.85 : 1.05,
          ease: "power4.out",
          delay,
          stagger: split === "chars" ? Math.min(stagger, 0.035) : stagger,
          scrollTrigger:
            trigger === "scroll"
              ? { trigger: el, start: "top 88%", once: true }
              : undefined,
        });
      });

      return () => {
        off();
        instance.revert();
      };
    },
    { scope: ref, dependencies: [children, split] }
  );

  const Tag = as as unknown as React.ComponentType<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    "data-reveal"?: string;
    children?: React.ReactNode;
  }>;
  return (
    <Tag ref={ref} className={className} data-reveal="">
      {children}
    </Tag>
  );
}
