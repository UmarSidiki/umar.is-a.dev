"use client";

import React from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import HeroVisual from "@/components/three/HeroVisual";
import SplitReveal from "@/components/motion/SplitReveal";
import Greeting from "@/components/motion/Greeting";
import Magnetic from "@/components/motion/Magnetic";
import Marquee from "@/components/motion/Marquee";
import { user } from "@/providers/user";

export default function Hero() {
  const techNames = user.technologies.map((t) => t.name);
  const year = new Date().getFullYear();

  return (
    /* bg-background + isolate give the mix-blend-difference headline an opaque
       backdrop inside its own stacking context, so it inverts against the paper
       and against the object — and never composites as raw white. */
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-background pt-20 lg:pt-24"
    >
      <div className="mx-auto flex w-full max-w-[110rem] flex-1 flex-col px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-hairline pb-4">
          <span className="label-mono flex items-center gap-2 text-foreground">
            <span
              className="h-2 w-2 rounded-full bg-signal"
              aria-hidden="true"
            />
            {user.homepage.availability.status}
          </span>
          <span className="label-mono text-ink-soft">
            {user.location.city}, {user.location.country}
          </span>
          <span className="label-mono ml-auto hidden text-ink-soft sm:inline">
            Portfolio — {year}
          </span>
        </div>

        <p className="mt-8 flex items-baseline gap-2 font-display text-lg font-semibold sm:mt-10 sm:text-2xl">
          <Greeting />
          <span className="text-ink-soft">— I&apos;m</span>
        </p>

        <h1 className="name-difference relative z-10 mt-1">
          <SplitReveal
            as="span"
            split="chars"
            trigger="load"
            delay={0.05}
            stagger={0.022}
            className="display-name block"
          >
            {user.name}
          </SplitReveal>
        </h1>

        {/* In flow on mobile, between the name and the intro, so it never sits
            behind body copy. From lg it is pulled behind the headline. */}
        <div className="pointer-events-none relative z-0 mx-auto my-8 aspect-square w-[72%] max-w-[21rem] self-end lg:absolute lg:right-[-6vw] lg:top-[7vh] lg:z-0 lg:my-0 lg:h-[52vh] lg:max-h-[40rem] lg:w-[46vw] lg:max-w-[44rem]">
          <HeroVisual />
        </div>

        <div className="relative z-10 mt-auto grid gap-8 border-t border-hairline pt-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="label-mono text-signal">{user.title}</p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
              {user.homepage.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <Magnetic>
              <Link
                href="/projects"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-signal px-7 py-4 text-sm font-medium text-signal-ink transition-colors hover:bg-foreground hover:text-background"
              >
                {user.homepage.callToAction.primary}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Magnetic>
            <a
              href={user.Resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center rounded-full border border-hairline px-7 py-4 text-sm font-medium transition-colors hover:border-signal hover:text-signal"
            >
              {user.homepage.callToAction.secondary}
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-10 border-y border-hairline">
        <Marquee
          items={techNames}
          itemClassName="label-mono text-ink-soft"
          duration={34}
          className="py-4"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[110rem] items-center justify-between px-5 py-3 sm:px-8 lg:px-12">
        <a
          href="#services"
          className="tap label-mono text-ink-soft transition-colors hover:text-signal"
        >
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          Scroll
        </a>
        <span className="label-mono text-ink-soft">
          {user.location.city.toUpperCase()} / {user.experience[0].period}
        </span>
      </div>
    </section>
  );
}
