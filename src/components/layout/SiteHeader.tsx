"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { ArrowUpRight, Moon, Sun, X } from "lucide-react";
import { useLenis } from "@/providers/SmoothScrollProvider";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", href: "/", index: "01" },
  { label: "Projects", href: "/projects", index: "02" },
  { label: "Blog", href: "/blog", index: "03" },
  { label: "Contact", href: "/contact", index: "04" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { lenis } = useLenis();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isAdmin = pathname?.startsWith("/admin") ?? false;

  // Close the menu whenever the route changes (the header never remounts).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock + Esc + focus management while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();

    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        ) ?? []
      );
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      lenis?.start();
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, lenis]);

  if (isAdmin) return null;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[210] focus:rounded-full focus:bg-signal focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-signal-ink"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-colors duration-300",
          scrolled ? "border-b border-hairline bg-background/90 backdrop-blur-sm" : "border-b border-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-[110rem] items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
          <Link
            href="/"
            className="group flex items-baseline gap-2"
            aria-label="Umar Siddiqui — home"
          >
            <span className="font-display text-lg font-extrabold tracking-tight lg:text-xl">
              Umar Siddiqui
            </span>
            <span className="label-mono hidden text-ink-soft sm:inline">
              Full-Stack Dev
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-baseline gap-1.5 text-sm transition-colors",
                        active ? "text-signal" : "text-foreground hover:text-signal"
                      )}
                    >
                      <span className="label-mono text-[0.6rem] text-ink-soft group-hover:text-signal">
                        {item.index}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle colour theme"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline transition-colors hover:border-signal hover:text-signal"
            >
              <Sun className="h-4 w-4 dark:hidden" aria-hidden="true" />
              <Moon className="hidden h-4 w-4 dark:block" aria-hidden="true" />
            </button>

            <Link
              href="/contact"
              className="hidden items-center gap-1 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-signal hover:text-signal-ink lg:inline-flex"
            >
              Get in touch
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline lg:hidden"
            >
              <span className="flex flex-col items-end gap-1.5" aria-hidden="true">
                <span className="block h-0.5 w-6 bg-foreground" />
                <span className="block h-0.5 w-4 bg-signal" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "fixed inset-0 z-[190] flex flex-col bg-foreground text-background transition-[clip-path] duration-500 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        style={{
          clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        }}
      >
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <span className="label-mono text-background/60">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-background/25"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-5 sm:px-8">
          <ul className="flex flex-col">
            {NAV.map((item, i) => (
              <li key={item.href} className="border-b border-background/15">
                <Link
                  href={item.href}
                  className="flex items-baseline justify-between py-5 transition-transform duration-300 hover:translate-x-2"
                  style={{
                    transitionDelay: open ? `${120 + i * 55}ms` : "0ms",
                    opacity: open ? 1 : 0,
                    transform: open ? "translateY(0)" : "translateY(14px)",
                    transitionProperty: "opacity, transform",
                  }}
                >
                  <span className="display-lg">{item.label}</span>
                  <span className="label-mono text-background/50">{item.index}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-between px-5 pb-8 sm:px-8">
          <Link href="/contact" className="text-sm underline underline-offset-4">
            siddiquiumar0007@gmail.com
          </Link>
          <span className="label-mono text-background/50">Sukkur, PK</span>
        </div>
      </div>
    </>
  );
}
