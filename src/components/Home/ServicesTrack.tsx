"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { services } from "@/providers/user";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TOTAL = services.length;

/**
 * "What I do".
 *
 * lg and up: a pinned, scrubbed horizontal track with an accent rule that draws
 * in and a counter that scrubs with the scroll. Below lg (and for reduced
 * motion): a native scroll-snap carousel — no pinning, no JS-driven scroll.
 */
export default function ServicesTrack() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track || prefersReducedMotion()) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const distance = () =>
          Math.max(track.scrollWidth - window.innerWidth + 96, 1);

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
            onUpdate: (self) => {
              setIndex(
                Math.min(TOTAL, Math.max(1, Math.ceil(self.progress * TOTAL) || 1))
              );
            },
          },
        });

        gsap.from(ruleRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        });

        return () => tween.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const onMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    const progress = max > 0 ? el.scrollLeft / max : 0;
    setIndex(Math.min(TOTAL, Math.max(1, Math.round(progress * (TOTAL - 1)) + 1)));
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-hairline py-20 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0 motion-reduce:lg:block motion-reduce:lg:h-auto motion-reduce:lg:py-20"
    >
      <div className="mx-auto w-full max-w-[110rem] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="label-mono text-ink-soft">02 — Services</span>
            <h2 className="display-xl mt-3 text-foreground">What I do</h2>
          </div>
          <div className="flex items-end gap-6">
            <span className="label-mono text-ink-soft" aria-hidden="true">
              <span className="text-signal">
                {String(index).padStart(2, "0")}
              </span>{" "}
              / {String(TOTAL).padStart(2, "0")}
            </span>
            <span className="hidden text-signal lg:inline">
              <span className="label-mono text-ink-soft">Scroll →</span>
            </span>
          </div>
        </div>
        <span
          ref={ruleRef}
          aria-hidden="true"
          className="mt-6 block h-px w-full origin-left bg-signal"
        />
      </div>

      {/* Desktop: pinned horizontal track. Numerals are outlined so the sequence
          reads as an index rather than a wall of filled type. */}
      <div
        ref={trackRef}
        className="mt-12 hidden lg:mt-16 lg:flex lg:w-max lg:flex-row lg:items-stretch lg:gap-10 lg:pl-12 lg:pr-12 [&>*]:shrink-0 motion-reduce:lg:mt-12 motion-reduce:lg:w-full motion-reduce:lg:flex-col motion-reduce:lg:gap-0 motion-reduce:lg:pl-0 motion-reduce:lg:pr-0"
      >
        {services.map((service, i) => (
          <article
            key={service.title}
            className="flex w-[34vw] min-w-[22rem] flex-col justify-between border-l border-hairline px-8 py-4 lg:w-[30vw] motion-reduce:lg:w-full motion-reduce:lg:border-l-0 motion-reduce:lg:border-t motion-reduce:lg:px-0 motion-reduce:lg:py-8"
            style={{
              transform:
                i % 2 === 1 ? "translateY(2.5rem)" : "translateY(0)",
            }}
          >
            <span className="index-numeral index-hollow block text-7xl lg:text-[9rem]">
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

      {/* Mobile / touch: a snap carousel, with a rule that mirrors progress. */}
      <div
        ref={mobileTrackRef}
        onScroll={onMobileScroll}
        className="scrollbar-hide -mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 lg:hidden"
      >
        {services.map((service, i) => (
          <article
            key={service.title}
            className="w-[82vw] max-w-[22rem] shrink-0 snap-start border-t border-hairline pt-6"
          >
            <span className="index-numeral index-hollow-signal block text-6xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="display-lg mt-4 max-w-[14ch] text-foreground">
              {service.title}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              {service.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
