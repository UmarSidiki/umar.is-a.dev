"use client";

import React from "react";
import Reveal from "@/components/motion/Reveal";
import { user } from "@/providers/user";

export default function AboutSection() {
  return (
    <section id="about" className="border-t border-hairline">
      <div className="mx-auto max-w-[110rem] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <span className="label-mono text-ink-soft">05 — About</span>

        <div className="mt-8 grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal self>
              <p className="display-lg max-w-[22ch] text-foreground">
                {user.title} based in {user.location.city}.
              </p>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-ink-soft">
                {user.homepage.tagline}
              </p>
            </Reveal>

            <div className="mt-14 space-y-10">
              <div>
                <h3 className="label-mono border-b border-hairline pb-3 text-ink-soft">
                  Experience
                </h3>
                <ul className="mt-6 space-y-8">
                  {user.experience.map((exp) => (
                    <li key={exp.title} className="grid gap-2 sm:grid-cols-[auto_1fr] sm:gap-6">
                      <span className="label-mono text-signal sm:w-28 sm:pt-1">
                        {exp.period}
                      </span>
                      <div>
                        <p className="font-display text-lg font-bold">{exp.title}</p>
                        <p className="text-sm text-ink-soft">{exp.company}</p>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                          {exp.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="label-mono border-b border-hairline pb-3 text-ink-soft">
                  Education
                </h3>
                <ul className="mt-6 space-y-6">
                  {user.education.map((edu) => (
                    <li key={edu.degree} className="grid gap-2 sm:grid-cols-[auto_1fr] sm:gap-6">
                      <span className="label-mono text-signal sm:w-28 sm:pt-1">{edu.year}</span>
                      <div>
                        <p className="font-display text-base font-bold">{edu.degree}</p>
                        <p className="text-sm text-ink-soft">{edu.institution}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <Reveal self className="lg:sticky lg:top-28 lg:self-start">
            <h3 className="label-mono border-b border-hairline pb-3 text-ink-soft">Skills</h3>
            <ul className="mt-6 space-y-6">
              {user.skills.map((skill) => (
                <li key={skill.name}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="label-mono text-ink-soft">{skill.proficiency}</span>
                  </div>
                  <div className="mt-2 h-px w-full bg-hairline" aria-hidden="true">
                    <div
                      className="h-px bg-signal"
                      style={{ width: skill.proficiency }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-12 border-t border-hairline pt-8">
              <h3 className="label-mono text-ink-soft">Get in touch</h3>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a
                    href={`mailto:${user.email}`}
                    className="break-all text-foreground transition-colors hover:text-signal"
                  >
                    {user.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${user.phone.replace(/\s/g, "")}`}
                    className="text-foreground transition-colors hover:text-signal"
                  >
                    {user.phone}
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
