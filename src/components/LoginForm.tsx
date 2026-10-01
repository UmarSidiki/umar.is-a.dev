"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const fieldClass =
  "w-full border border-hairline bg-transparent px-4 py-3 text-base text-foreground placeholder:text-ink-soft focus:border-signal focus:outline-none";

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const success = await login(username, password);
      if (success) onLoginSuccess?.();
      else setError("Invalid username or password.");
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-24">
      <div className="w-full max-w-sm">
        <div>
          <span className="label-mono block text-signal">Admin</span>
          <span className="block font-display text-lg font-extrabold leading-tight tracking-tight text-foreground">
            Umar Siddiqui
          </span>
        </div>
        <h1 className="display-lg mt-6 text-foreground">Sign in</h1>
        <p className="mt-4 text-sm text-ink-soft">Access the dashboard to manage content.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6" noValidate>
          {error && (
            <div
              role="alert"
              className="border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="label-mono mb-2 block text-ink-soft">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className={fieldClass}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="label-mono mb-2 block text-ink-soft">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className={fieldClass}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-14 w-full items-center justify-center rounded-full bg-signal text-sm font-medium text-signal-ink transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <Link
          href="/"
          className="label-mono mt-10 inline-flex min-h-11 items-center text-ink-soft transition-colors hover:text-foreground"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
