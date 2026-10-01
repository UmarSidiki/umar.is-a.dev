"use client";

import React from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import HeroVisual from "@/components/three/HeroVisual";
import SplitReveal from "@/components/motion/SplitReveal";
import Magnetic from "@/components/motion/Magnetic";
import Marquee from "@/components/motion/Marquee";
import { user } from "@/providers/user";

export default function Hero() {
  const techNames = user.technologies.map((t) => t.name);

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full opacity-60 lg:w-[62%] lg:opacity-100">
        <HeroVisual />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[110rem] px-5 pb-8 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="label-mono flex items-center gap-2 text-foreground">
            <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
            {user.homepage.availability.status}
          </span>
          <span className="label-mono text-ink-soft">
            {user.location.city}, {user.location.country}
          </span>
        </div>

        <SplitReveal
          as="h1"
          trigger="load"
          delay={0.15}
          stagger={0.09}
          className="display-hero max-w-[16ch] text-foreground"
        >
          Full-Stack Developer
        </SplitReveal>

        <div className="mt-8 grid gap-8 border-t border-hairline pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
            {user.homepage.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-signal px-7 py-4 text-sm font-medium text-signal-ink transition-colors hover:bg-foreground hover:text-background"
              >
                {user.homepage.callToAction.primary}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Magnetic>
            <a
              href={user.Resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-hairline px-7 py-4 text-sm font-medium transition-colors hover:border-signal hover:text-signal"
            >
              {user.homepage.callToAction.secondary}
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-y border-hairline">
        <Marquee
          items={techNames}
          itemClassName="label-mono text-ink-soft"
          duration={34}
          className="py-4"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[110rem] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a
          href="#services"
          className="label-mono flex items-center gap-2 text-ink-soft transition-colors hover:text-signal"
        >
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          Scroll
        </a>
        <span className="label-mono hidden text-ink-soft sm:inline">
          Portfolio — {new Date().getFullYear()}
        </span>
      </div>
    </section>
  );
}
