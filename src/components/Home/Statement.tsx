"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { user } from "@/providers/user";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DIM = 0.18;

/**
 * The page's one full-bleed ink moment. The bio is set large and every word is
 * lit from muted paper to full paper as the section scrubs through the viewport.
 *
 * Words are only ever dimmed by script: without JS, or under reduced motion,
 * the paragraph is simply fully visible.
 */
export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const words = user.experience[0].description.split(" ");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const nodes = textRef.current?.querySelectorAll<HTMLElement>(".word");
      if (!nodes || nodes.length === 0) return;

      // Applied in the layout pass, so the dimmed starting state is what gets
      // painted first — the words only ever get brighter from here.
      gsap.set(nodes, { opacity: DIM });
      gsap.to(nodes, {
        opacity: 1,
        ease: "none",
        stagger: 0.045,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          end: "top 26%",
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-label="About in one paragraph"
      className="section-ink relative"
    >
      <div className="mx-auto max-w-[110rem] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <span className="label-mono opacity-70">01 — In one line</span>
          <span className="label-mono opacity-70">
            {user.location.city}, {user.location.country}
          </span>
        </div>

        <p
          ref={textRef}
          data-reveal-dim=""
          className="statement mt-10 max-w-[46ch] font-display text-[clamp(1.5rem,4.4vw,3.4rem)] font-bold leading-[1.14] tracking-tight"
        >
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className="word inline-block">
              {word}
              {"\u00A0"}
            </span>
          ))}
        </p>

        <dl className="mt-14 grid gap-8 border-t border-hairline pt-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="label-mono opacity-70">Currently</dt>
            <dd className="mt-2 font-display text-lg font-bold">
              {user.experience[0].period} — {user.experience[0].title}
            </dd>
          </div>
          <div>
            <dt className="label-mono opacity-70">Studied</dt>
            <dd className="mt-2 font-display text-lg font-bold">
              {user.education[0].degree}
            </dd>
            <dd className="text-sm opacity-70">{user.education[0].institution}</dd>
          </div>
          <div>
            <dt className="label-mono opacity-70">Status</dt>
            <dd className="mt-2 flex items-center gap-2 font-display text-lg font-bold">
              <span
                className="h-2 w-2 rounded-full bg-signal"
                aria-hidden="true"
              />
              {user.homepage.availability.status}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
