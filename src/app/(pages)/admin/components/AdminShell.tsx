"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  FileText,
  Image as ImageIcon,
  LogOut,
  Menu,
  Rocket,
  X,
} from "lucide-react";
import { AdminTab } from "../types";

interface AdminShellProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const TABS: { id: AdminTab; label: string; Icon: IconComponent }[] = [
  { id: "dashboard", label: "Dashboard", Icon: BarChart3 },
  { id: "posts", label: "Posts", Icon: FileText },
  { id: "projects", label: "Projects", Icon: Rocket },
  { id: "images", label: "Images", Icon: ImageIcon },
];

function Brand({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <span className="label-mono block text-signal">Admin</span>
      <span className="font-display text-lg font-extrabold leading-tight tracking-tight">
        Umar Siddiqui
      </span>
    </div>
  );
}

/**
 * Admin chrome: a persistent sidebar from lg up, a sticky top bar with a
 * focus-trapped drawer below that. Presentational only — data, auth and the
 * tab content are owned by the page.
 */
export function AdminShell({
  activeTab,
  onTabChange,
  onLogout,
  children,
}: AdminShellProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const active = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];

  const select = (tab: AdminTab) => {
    onTabChange(tab);
    setOpen(false);
  };

  const signOut = () => {
    if (confirm("Sign out of the admin panel?")) onLogout();
  };

  // Drawer: scroll lock, Esc and a focus trap.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
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
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const navItems = (onSelect: (tab: AdminTab) => void, current: AdminTab) =>
    TABS.map(({ id, label, Icon }) => {
      const isActive = id === current;
      return (
        <li key={id}>
          <button
            type="button"
            onClick={() => onSelect(id)}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-11 w-full items-center gap-3 px-3 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "bg-signal/10 text-signal"
                : "text-ink-soft hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {label}
          </button>
        </li>
      );
    });

  return (
    <div className="min-h-screen lg:pl-64">
      {/* Desktop sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-hairline bg-card lg:flex"
      >
        <Brand className="border-b border-hairline px-6 py-6" />
        <nav aria-label="Admin sections" className="flex-1 px-3 py-4">
          <ul className="space-y-1">{navItems(onTabChange, activeTab)}</ul>
        </nav>
        <div className="space-y-1 border-t border-hairline px-3 py-4">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2 px-3 py-3 text-sm text-ink-soft transition-colors hover:text-signal"
          >
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            View site
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex min-h-11 w-full items-center gap-2 px-3 py-3 text-sm text-ink-soft transition-colors hover:text-destructive"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 border-b border-hairline bg-background/95 backdrop-blur-sm lg:hidden">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <Brand />
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="admin-drawer"
            aria-label="Open admin menu"
            className="inline-flex h-11 w-11 items-center justify-center border border-hairline"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Title bar */}
      <div className="border-b border-hairline lg:sticky lg:top-0 lg:z-30 lg:bg-background/95 lg:backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-baseline gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            {active.label}
          </h1>
          <span className="label-mono text-ink-soft">/ {activeTab}</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 lg:px-8">
        {children}
      </div>

      {/* Mobile drawer */}
      <div
        id="admin-drawer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Admin menu"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-50 bg-background transition-[clip-path] duration-300 lg:hidden ${
          open
            ? "pointer-events-auto"
            : "pointer-events-none"
        }`}
        style={{ clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
      >
        <div className="flex h-14 items-center justify-between border-b border-hairline px-4">
          <Brand />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close admin menu"
            className="inline-flex h-11 w-11 items-center justify-center border border-hairline"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Admin sections" className="px-3 py-4">
          <ul className="space-y-1">{navItems(select, activeTab)}</ul>
          <div className="mt-6 space-y-1 border-t border-hairline pt-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center gap-2 px-3 py-3 text-sm text-ink-soft transition-colors hover:text-signal"
            >
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              View site
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="flex min-h-11 w-full items-center gap-2 px-3 py-3 text-sm text-ink-soft transition-colors hover:text-destructive"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

/** Desktop content is offset past the fixed sidebar. */
export const ADMIN_CONTENT_OFFSET = "lg:pl-64";
