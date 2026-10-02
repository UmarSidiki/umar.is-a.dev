"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface MarqueeProps {
  items: string[];
  duration?: number;
  reverse?: boolean;
  separator?: string;
  className?: string;
  itemClassName?: string;
}

/**
 * CSS marquee. Pure transform animation, pauses on hover, static under
 * reduced motion. Decorative, so hidden from assistive tech.
 */
export default function Marquee({
  items,
  duration = 32,
  reverse = false,
  separator = "✳",
  className,
  itemClassName,
}: MarqueeProps) {
  const reduced = usePrefersReducedMotion();

  const Group = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <React.Fragment key={`${item}-${i}`}>
          <span className={cn("px-5", itemClassName)}>{item}</span>
          <span aria-hidden="true" className="text-signal">
            {separator}
          </span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className={cn(
        "group flex w-full overflow-hidden",
        reduced && "justify-center",
        className
      )}
    >
      <div
        className={cn(
          "flex w-max",
          !reduced &&
            (reverse ? "animate-marquee-reverse" : "animate-marquee"),
          "hover:[animation-play-state:paused]"
        )}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {Group}
        {!reduced && Group}
      </div>
    </div>
  );
}
