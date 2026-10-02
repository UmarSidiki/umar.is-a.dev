"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/motion/Magnetic";
import Reveal from "@/components/motion/Reveal";
import { user } from "@/providers/user";

export default function ContactCTA() {
  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-[110rem] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <Reveal>
          <span className="label-mono text-ink-soft">06 — Contact</span>
          <h2 className="display-xl mt-6 max-w-[18ch] text-foreground">
            Have a project? Let&apos;s talk.
          </h2>
          <p className="mt-6 max-w-lg text-lg text-ink-soft">
            {user.contact.formSubtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-signal px-8 py-4 text-sm font-medium text-signal-ink transition-colors hover:bg-foreground hover:text-background"
              >
                Start a conversation
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Magnetic>
            <a
              href={`mailto:${user.email}`}
              className="text-sm text-ink-soft underline underline-offset-4 transition-colors hover:text-signal"
            >
              {user.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
