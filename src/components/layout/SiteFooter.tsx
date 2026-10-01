"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { user } from "@/providers/user";
import { useLenis } from "@/providers/SmoothScrollProvider";

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
    <footer className="relative border-t border-hairline">
      <div className="mx-auto max-w-[110rem] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="label-mono text-ink-soft">Let&apos;s build something</p>
            <a
              href={`mailto:${user.email}`}
              className="display-lg mt-4 inline-block break-all transition-colors hover:text-signal"
            >
              {user.email}
            </a>
            <p className="mt-6 max-w-md text-sm text-ink-soft">
              {user.location.city}, {user.location.region}, {user.location.country}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <nav aria-label="Footer">
              <p className="label-mono text-ink-soft">Index</p>
              <ul className="mt-4 space-y-3">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-foreground transition-colors hover:text-signal"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="label-mono text-ink-soft">Elsewhere</p>
              <ul className="mt-4 space-y-3">
                {user.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground transition-colors hover:text-signal"
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
                    className="text-sm text-foreground transition-colors hover:text-signal"
                  >
                    Resume
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono text-ink-soft">
            © {year} {user.name}
          </p>
          <button
            type="button"
            onClick={toTop}
            className="label-mono self-start text-foreground transition-colors hover:text-signal sm:self-auto"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
