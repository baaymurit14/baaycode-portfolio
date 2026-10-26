"use client";

import { useEffect } from "react";

/**
 * Browsers restore the previous scroll position on reload, which drops visitors
 * into the middle of the page. A reload always starts at the top; a fresh
 * navigation with a section hash (`/#work`) can still resolve to its target.
 */
export default function ScrollToTop() {
  useEffect(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const isReload = navigation?.type === "reload";

    if (isReload && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (!isReload && window.location.hash) return;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previousBehavior;
  }, []);

  return null;
}
