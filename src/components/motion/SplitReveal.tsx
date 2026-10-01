"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

interface SplitRevealProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  delay?: number;
  stagger?: number;
  /** "scroll" animates in on enter; "load" plays immediately. */
  trigger?: "scroll" | "load";
}

/**
 * Masked line-by-line text reveal using GSAP SplitText.
 */
export default function SplitReveal({
  children,
  className,
  as = "h2",
  delay = 0,
  stagger = 0.07,
  trigger = "scroll",
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const split = new SplitText(el, {
        type: "lines",
        mask: "lines",
        linesClass: "pb-[0.12em]",
      });

      gsap.from(split.lines, {
        yPercent: 115,
        duration: 1.05,
        ease: "power4.out",
        delay,
        stagger,
        scrollTrigger:
          trigger === "scroll"
            ? { trigger: el, start: "top 88%", once: true }
            : undefined,
      });
    },
    { scope: ref, dependencies: [children] }
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
