"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { ArrowUp } from "lucide-react";
import { user } from "@/providers/user";
import { useLenis } from "@/providers/SmoothScrollProvider";
import Magnetic from "@/components/motion/Magnetic";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

export default function SiteFooter() {
  const pathname = usePathname();
  const { lenis } = useLenis();
  const year = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) return null;

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-hairline">
      <div className="mx-auto max-w-[110rem] px-5 pb-8 pt-16 sm:px-8 lg:px-12 lg:pb-10 lg:pt-24">
        <p className="label-mono text-ink-soft">Let&apos;s build something</p>

        <Magnetic className="mt-4 block">
          <Link
            href="/contact"
            className="block max-w-fit font-display text-[clamp(3.2rem,15vw,12rem)] font-extrabold leading-[0.84] tracking-[-0.045em] transition-colors hover:text-signal"
          >
            Let&apos;s talk
            <span className="text-signal">.</span>
          </Link>
        </Magnetic>

        <div className="mt-12 grid gap-10 border-t border-hairline pt-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <p className="label-mono text-ink-soft">Direct</p>
            <a
              href={`mailto:${user.email}`}
              className="tap mt-3 break-all font-display text-lg font-bold tracking-tight transition-colors hover:text-signal sm:text-2xl"
            >
              {user.email}
            </a>
            <ul className="mt-6 space-y-1">
              <li>
                <a
                  href={`tel:${user.phone.replace(/\s/g, "")}`}
                  className="tap label-mono text-ink-soft transition-colors hover:text-signal"
                >
                  {user.phone}
                </a>
              </li>
              <li className="label-mono pt-2 text-ink-soft">
                {user.location.city}, {user.location.region},{" "}
                {user.location.country}
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <nav aria-label="Footer">
              <p className="label-mono text-ink-soft">Index</p>
              <ul className="mt-3">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="tap text-sm text-foreground transition-colors hover:text-signal"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="label-mono text-ink-soft">Elsewhere</p>
              <ul className="mt-3">
                {user.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tap text-sm text-foreground transition-colors hover:text-signal"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={user.Resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap text-sm text-foreground transition-colors hover:text-signal"
                  >
                    Resume
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono text-ink-soft">
            © {year} {user.name}
          </p>
          <button
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            className="tap label-mono self-start text-foreground transition-colors hover:text-signal sm:self-auto"
          >
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
