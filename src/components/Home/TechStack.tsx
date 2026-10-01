"use client";

import React from "react";
import Marquee from "@/components/motion/Marquee";
import Reveal from "@/components/motion/Reveal";
import { user } from "@/providers/user";

export default function TechStack() {
  const names = user.technologies.map((t) => t.name);

  return (
    <section id="stack" className="border-t border-hairline">
      <div className="mx-auto max-w-[110rem] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <span className="label-mono text-ink-soft">04 — Toolbox</span>
        <h2 className="display-xl mt-3 text-foreground">Technologies</h2>

        <Reveal className="mt-14 grid grid-cols-2 border-t border-l border-hairline sm:grid-cols-3 lg:grid-cols-4">
          {names.map((name, i) => (
            <div
              key={name}
              className="group relative flex min-h-[7.5rem] flex-col justify-between border-b border-r border-hairline p-5 transition-colors hover:bg-signal hover:text-signal-ink"
            >
              <span className="label-mono text-ink-soft transition-colors group-hover:text-signal-ink/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-lg font-bold tracking-tight sm:text-xl">
                {name}
              </span>
            </div>
          ))}
        </Reveal>

        <div className="mt-14 border-y border-hairline py-5">
          <Marquee
            items={["React", "Next.js", "TypeScript", "Node.js", "React Native", "MongoDB", "Express", "Prisma"]}
            itemClassName="font-display text-2xl font-bold sm:text-4xl"
            duration={40}
            reverse
          />
        </div>
      </div>
    </section>
  );
}
