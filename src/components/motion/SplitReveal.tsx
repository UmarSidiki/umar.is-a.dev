"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { usePageReady } from "@/hooks/usePageReady";

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
 * visible without JS; the split only ever happens once the page is actually on
 * screen, so a reveal can never play behind the transition curtain.
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
  const ready = usePageReady();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !ready || prefersReducedMotion()) return;

      const instance = new SplitText(el, {
        type: split === "chars" ? "lines,chars" : "lines",
        mask: "lines",
        linesClass: "pb-[0.12em]",
      });

      const targets =
        split === "chars" && instance.chars.length > 0
          ? instance.chars
          : instance.lines;

      gsap.from(targets, {
        yPercent: 115,
        duration: split === "chars" ? 0.85 : 1.05,
        ease: "power4.out",
        delay,
        stagger: split === "chars" ? Math.min(stagger, 0.035) : stagger,
        scrollTrigger:
          trigger === "scroll"
            ? { trigger: el, start: "top 88%", once: true }
            : undefined,
      });

      return () => instance.revert();
    },
    { scope: ref, dependencies: [children, ready, split] }
  );

  const Tag = as as unknown as React.ComponentType<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    children?: React.ReactNode;
  }>;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
