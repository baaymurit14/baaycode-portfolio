"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { brand, nav, profile, siteUrl } from "@/lib/data";
import BrandMark from "./BrandMark";
import Monogram from "./Monogram";

/**
 * Fixed navigation.
 *
 * - Left: PDS monogram + BAAYCODE wordmark. The brand leads, the name is one
 *   hover away — matching the BAAYCODE / Pape Djibril Sène hierarchy.
 * - Centre: the narrative movements, with the active section underlined.
 * - Right: the domain, doubling as proof the site is deployed.
 * - A 1px copper progress line at the very top reports reading position.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("hero");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        setScrolled(y > 24);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      // Only the band crossing the upper-middle of the viewport counts, so the
      // active item doesn't flicker between two tall adjacent sections.
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );

    nav.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-line bg-base/88 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      {/* Reading progress. Copper = the human thread running through the page. */}
      <div
        aria-hidden="true"
        className="h-px w-full origin-left bg-copper/70"
        style={{ transform: `scaleX(${progress})` }}
      />

      <nav className="container-bleed flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <Link
          href="/"
          aria-label={`${brand.mark} — ${brand.person}, accueil`}
          className="group flex shrink-0 items-center gap-3"
        >
          <Monogram size="sm" />
          <span className="hidden flex-col leading-none sm:flex">
            <BrandMark size="sm" />
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faint">
              {profile.role}
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-6 xl:flex">
          {nav.slice(0, 7).map((item) => (
            <li key={item.id}>
              <a
                href={`/#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className={`group relative block py-1 font-mono text-[11px] uppercase tracking-wide2 transition-colors duration-200 ${
                  active === item.id
                    ? "text-ink"
                    : "text-ink-faint hover:text-ink-muted"
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-0.5 left-0 h-px bg-copper transition-all duration-400 ease-editorial ${
                    active === item.id ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="hidden border border-line-strong px-4 py-2 font-mono text-[11px] uppercase tracking-wide2 text-ink transition-colors duration-200 hover:border-copper hover:text-copper lg:inline-flex"
          >
            Me contacter
          </a>
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");

  // Lock body scroll while the panel is open so the page behind doesn't move.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape closes, and focus returns to the trigger.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("hero");
      if (!el) return;
      setActive(window.scrollY < el.offsetHeight * 0.5 ? "hero" : "");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const domain = siteUrl.replace("https://", "");

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
      >
        <span
          className={`block h-px w-5 bg-ink transition-transform duration-300 ${
            open ? "translate-y-[3px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-px w-5 bg-ink transition-opacity duration-200 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-px w-5 bg-ink transition-transform duration-300 ${
            open ? "-translate-y-[3px] -rotate-45" : ""
          }`}
        />
      </button>

      {/* Always mounted so `aria-controls` on the trigger always resolves to a
          real element; `hidden` keeps it out of the tab order when closed. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-line bg-base/97 backdrop-blur-xl lg:top-16"
      >
          <div className="container-bleed flex min-h-full flex-col py-8">
            <ul className="flex flex-col">
              {nav.map((item, i) => (
                <li key={item.id} className="border-b border-line/70">
                  <a
                    href={`/#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-3.5"
                  >
                    <span className="font-mono text-[10px] text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-2xl uppercase ${
                        active === item.id ? "text-copper" : "text-ink"
                      }`}
                    >
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-5 pt-10">
              <a
                href={`mailto:${profile.email}`}
                onClick={() => setOpen(false)}
                className="btn-primary w-full justify-center"
              >
                {profile.email}
              </a>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-[11px] uppercase tracking-wide2 text-ink-muted hover:text-signal"
                >
                  GitHub
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-[11px] uppercase tracking-wide2 text-ink-muted hover:text-signal"
                >
                  LinkedIn
                </a>
                <a
                  href={profile.phone.replace(/\s/g, "")}
                  className="font-mono text-[11px] uppercase tracking-wide2 text-ink-muted hover:text-signal"
                >
                  {profile.phone}
                </a>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                {domain} — {brand.thesisFr}
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}
