"use client";

import { useEffect, useState } from "react";

/**
 * A single module-level gate that tells client components when the page they are
 * on is actually visible to the user.
 *
 * It exists so entrance animations do not play behind the curtain during a
 * navigation (or behind the preloader on first load). The gate starts closed on
 * both server and client, so hydration matches, and only ever opens — a page
 * whose animation never runs still shows fully visible SSR content.
 */

let ready = false;
const subscribers = new Set<() => void>();

/** Open the gate. Idempotent; every subscriber re-renders exactly once. */
export function markPageReady() {
  if (ready) return;
  ready = true;
  subscribers.forEach((notify) => notify());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("page:enter"));
  }
}

/** Close the gate again — used right before a client-side navigation. */
export function armPageGate() {
  ready = false;
}

export function isPageReady() {
  return ready;
}

/**
 * Run `fn` the moment the current page is on screen — synchronously if the gate
 * is already open, otherwise on the next opening. Returns an unsubscribe.
 *
 * Entrance animations use this instead of a state flag so they can hide their
 * targets during the mount (layout) pass — before the first paint, while the
 * curtain or the preloader is still up — and only then wait to be shown. That
 * ordering makes a visible → hidden → visible flash impossible.
 */
export function onPageEnter(fn: () => void): () => void {
  if (ready) {
    fn();
    return () => {};
  }

  let done = false;
  const handler = () => {
    if (done) return;
    done = true;
    window.removeEventListener("page:enter", handler);
    fn();
  };

  window.addEventListener("page:enter", handler);

  return () => {
    done = true;
    window.removeEventListener("page:enter", handler);
  };
}

/** True once the current page is on screen and entrance animations may run. */
export function usePageReady() {
  const [value, setValue] = useState(ready);

  useEffect(() => {
    if (value) return;
    const notify = () => setValue(true);
    subscribers.add(notify);
    // The gate may have opened between the first render and this effect.
    if (ready) notify();
    return () => {
      subscribers.delete(notify);
    };
  }, [value]);

  return value;
}
