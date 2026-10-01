"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { services } from "@/providers/user";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * "What I do" — a pinned, scrubbed horizontal sequence on large screens.
 * On small screens and reduced motion it degrades to a vertical stack.
 */
export default function ServicesTrack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track || prefersReducedMotion()) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const distance = () => track.scrollWidth - window.innerWidth + 96;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => tween.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-hairline py-20 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0 motion-reduce:lg:block motion-reduce:lg:h-auto motion-reduce:lg:py-20"
    >
      <div className="mx-auto w-full max-w-[110rem] px-5 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="label-mono text-ink-soft">02 — Services</span>
            <h2 className="display-xl mt-3 text-foreground">What I do</h2>
          </div>
          <span className="label-mono hidden text-ink-soft lg:inline">
            Scroll →
          </span>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-12 flex flex-col lg:mt-16 lg:w-max lg:flex-row lg:gap-8 lg:pl-12 lg:pr-12 [&>*]:shrink-0 motion-reduce:lg:mt-12 motion-reduce:lg:w-full motion-reduce:lg:flex-col motion-reduce:lg:gap-0 motion-reduce:lg:pl-0 motion-reduce:lg:pr-0"
      >
        {services.map((service, i) => (
          <article
            key={service.title}
            className="border-t border-hairline px-5 py-10 sm:px-8 lg:w-[42vw] lg:border-t-0 lg:border-l lg:border-hairline lg:px-10 lg:py-4"
          >
            <span className="index-numeral block text-signal text-6xl lg:text-8xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="display-lg mt-6 max-w-[14ch] text-foreground">
              {service.title}
            </h3>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              {service.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
