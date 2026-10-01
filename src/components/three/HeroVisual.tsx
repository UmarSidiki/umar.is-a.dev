"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Static stand-in for the WebGL object: the same silhouette, ink body and
 * vermilion rim, drawn with layered gradients. Shown while the canvas loads and
 * permanently for reduced motion, no-WebGL and low-power devices.
 */
function Poster() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative aspect-square w-[min(78%,34rem)]">
        <span className="object-halo" aria-hidden="true" />
        <span className="object-poster" aria-hidden="true" />
      </div>
    </div>
  );
}

export default function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [quality, setQuality] = useState<"high" | "low">("high");
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setWebgl(!!(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
    setReduced(prefersReducedMotion());
    const cores = navigator.hardwareConcurrency ?? 8;
    setQuality(cores <= 4 || window.innerWidth < 768 ? "low" : "high");
    setMounted(true);
  }, []);

  // Stop the render loop whenever the object is off screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show3d = mounted && webgl && !reduced;

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
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
