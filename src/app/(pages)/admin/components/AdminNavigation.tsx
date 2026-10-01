"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, FileText, Image as ImageIcon, LogOut, Menu, Rocket, X } from "lucide-react";
import { AdminTab } from "../types";

interface AdminNavigationProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
}

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const TABS: { id: AdminTab; label: string; Icon: IconComponent }[] = [
  { id: "dashboard", label: "Dashboard", Icon: BarChart3 },
  { id: "posts", label: "Posts", Icon: FileText },
  { id: "projects", label: "Projects", Icon: Rocket },
  { id: "images", label: "Images", Icon: ImageIcon },
];

export function AdminNavigation({ activeTab, onTabChange, onLogout }: AdminNavigationProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const select = (tab: AdminTab) => {
    onTabChange(tab);
    setOpen(false);
  };

  const logout = () => {
    if (confirm("Sign out of the admin panel?")) onLogout();
  };

  return (
    <header className="border-b border-hairline">
      <div className="flex items-center justify-between gap-4 py-5">
        <div>
          <span className="label-mono text-ink-soft">Admin</span>
          <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={logout}
            className="label-mono hidden h-11 items-center gap-2 border border-hairline px-4 transition-colors hover:border-destructive hover:text-destructive sm:inline-flex"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="admin-menu"
            aria-label="Open admin menu"
            className="inline-flex h-11 w-11 items-center justify-center border border-hairline sm:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Desktop tabs */}
      <nav aria-label="Admin sections" className="hidden sm:block">
        <ul className="flex gap-1">
          {TABS.map(({ id, label, Icon }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => onTabChange(id)}
                aria-current={activeTab === id ? "page" : undefined}
                className={`inline-flex h-12 items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors ${
                  activeTab === id
                    ? "border-signal text-signal"
                    : "border-transparent text-ink-soft hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile drawer */}
      <div
        id="admin-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Admin menu"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-[200] bg-background transition-opacity sm:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-hairline px-5">
          <span className="label-mono text-ink-soft">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close admin menu"
            className="inline-flex h-11 w-11 items-center justify-center border border-hairline"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Admin sections" className="p-5">
          <ul className="flex flex-col">
            {TABS.map(({ id, label, Icon }) => (
              <li key={id} className="border-b border-hairline">
                <button
                  type="button"
                  onClick={() => select(id)}
                  aria-current={activeTab === id ? "page" : undefined}
                  className={`flex w-full items-center gap-3 py-5 text-left font-display text-xl font-bold ${
                    activeTab === id ? "text-signal" : "text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={logout}
            className="label-mono mt-8 inline-flex h-12 items-center gap-2 border border-hairline px-5 transition-colors hover:border-destructive hover:text-destructive"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
