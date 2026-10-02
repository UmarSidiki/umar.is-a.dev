"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { onPageEnter } from "@/hooks/usePageReady";

gsap.registerPlugin(useGSAP);

/** The greeting list from the original site's DynamicHeadline, minus the flags. */
const GREETINGS = [
  "Hello",
  "Hola",
  "Salut",
  "Hallo",
  "你好",
  "Olá",
  "Ciao",
  "こんにちは",
  "مرحبا",
  "नमस्ते",
];

const HOLD_MS = 2200;

/**
 * Rotating greeting word. Starts on the visitor's own language when it is one we
 * know, and holds still under reduced motion.
 */
export default function Greeting() {
  const ref = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const reduced = prefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;

      // Hidden in the layout pass, before the first paint; the rise (and the
      // rotation timer) only start once the page is actually on screen.
      gsap.set(el, { yPercent: -55, autoAlpha: 0 });

      let rotateId = 0;
      const off = onPageEnter(() => {
        gsap.to(el, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.42,
          ease: "power3.out",
        });
        rotateId = window.setTimeout(
          () => setIndex((i) => (i + 1) % GREETINGS.length),
          HOLD_MS
        );
      });

      return () => {
        off();
        window.clearTimeout(rotateId);
      };
    },
    { scope: ref, dependencies: [index, reduced] }
  );

  // Match the visitor's language once the browser is available.
  React.useEffect(() => {
    const code = window.navigator.language.split("-")[0];
    const codes = ["en", "es", "fr", "de", "zh", "pt", "it", "ja", "ar", "hi"];
    const found = codes.indexOf(code);
    if (found > 0) setIndex(found);
  }, []);

  return (
    <>
      <span className="sr-only">{GREETINGS[0]}</span>
      <span
        className="relative inline-block min-w-[6ch] overflow-hidden text-signal"
        aria-hidden="true"
      >
        <span className="invisible">{GREETINGS[0]}</span>
        <span
          ref={ref}
          data-reveal=""
          className="absolute inset-0 whitespace-nowrap"
        >
          {GREETINGS[index]}
        </span>
      </span>
    </>
  );
}
