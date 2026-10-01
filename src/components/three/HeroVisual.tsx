"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

/** Cheap SVG poster shown while the canvas loads and as the static fallback. */
function Poster() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        viewBox="0 0 400 400"
        className="h-[78%] w-[78%] max-h-[520px] max-w-[520px]"
        aria-hidden="true"
      >
        <g fill="none" stroke="currentColor" strokeWidth="0.75">
          {[34, 58, 82, 106, 130].map((r, i) => (
            <circle
              key={r}
              cx="200"
              cy="200"
              r={r}
              className={i % 2 === 0 ? "text-signal/70" : "text-foreground/25"}
              style={{ transformOrigin: "200px 200px" }}
            />
          ))}
        </g>
        <circle cx="200" cy="200" r="150" fill="currentColor" className="text-signal/10" />
      </svg>
    </div>
  );
}

export default function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [quality, setQuality] = useState<"high" | "low">("high");
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const ok = !!(
        canvas.getContext("webgl2") || canvas.getContext("webgl")
      );
      setWebgl(ok);
    } catch {
      setWebgl(false);
    }
    setReduced(prefersReducedMotion());
    const cores = navigator.hardwareConcurrency ?? 8;
    setQuality(cores <= 4 || window.innerWidth < 768 ? "low" : "high");
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show3d = mounted && webgl && !reduced;

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      <div
        className={cn(
          "absolute inset-0 text-foreground transition-opacity duration-700",
          show3d ? "opacity-0" : "opacity-100"
        )}
      >
        <Poster />
      </div>
      {show3d && (
        <div className="absolute inset-0">
          <HeroScene quality={quality} frameloop={visible ? "always" : "never"} />
        </div>
      )}
    </div>
  );
}
