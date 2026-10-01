"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Marquee from "@/components/motion/Marquee";
import { user } from "@/providers/user";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { usePageReady } from "@/hooks/usePageReady";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Technologies as a dense typographic index plus two counter-running marquees.
 *
 * Rows are always in the DOM and legible: the entrance only slides each name up
 * from behind a mask, so if the trigger never fires the list is simply static —
 * never a bordered box of empty cells.
 */
export default function TechStack() {
  const listRef = useRef<HTMLOListElement>(null);
  const ready = usePageReady();
  const names = user.technologies.map((t) => t.name);

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list || !ready || prefersReducedMotion()) return;

      const targets = Array.from(
        list.querySelectorAll<HTMLElement>("[data-name]")
      );

      gsap.from(targets, {
        yPercent: 105,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: { trigger: list, start: "top 85%", once: true },
      });
    },
    { scope: listRef, dependencies: [ready] }
  );

  return (
    <section id="stack" className="border-t border-hairline">
      <div className="mx-auto max-w-[110rem] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="label-mono text-ink-soft">04 — Toolbox</span>
            <h2 className="display-xl mt-3 text-foreground">Technologies</h2>
          </div>
          <span className="label-mono text-ink-soft">
            {String(names.length).padStart(2, "0")} in daily use
          </span>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
          <ol ref={listRef} className="border-t border-hairline">
            {user.technologies.map((tech, i) => (
              <li
                key={tech.name}
                className="group flex min-h-11 items-baseline gap-4 border-b border-hairline py-4 sm:py-5"
              >
                <span className="label-mono w-8 shrink-0 text-ink-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="block overflow-hidden">
                  <span
                    data-name
                    className="block font-display text-2xl font-bold tracking-tight transition-all duration-300 group-hover:translate-x-1 group-hover:text-signal sm:text-4xl"
                  >
                    {tech.name}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="ml-auto self-center text-signal opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  ✳
                </span>
              </li>
            ))}
          </ol>

          <div className="flex flex-col justify-center gap-3 lg:pl-10">
            <div className="edge-fade border-y border-hairline py-4">
              <Marquee
                items={names}
                itemClassName="font-display text-[clamp(2rem,6vw,4.5rem)] font-extrabold tracking-tight"
                duration={38}
              />
            </div>
            <div className="edge-fade border-b border-hairline py-4">
              <Marquee
                items={names}
                itemClassName="font-display index-hollow text-[clamp(2rem,6vw,4.5rem)] font-extrabold tracking-tight"
                duration={38}
                reverse
                separator="—"
              />
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-soft">
              Chosen for shipped work, not for the logo: {names.slice(0, 3).join(", ")}{" "}
              and the rest of the list carry the production load across web and
              mobile.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
