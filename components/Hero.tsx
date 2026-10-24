"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { brand, profile, stats } from "@/lib/data";
import { media } from "@/lib/media";
import { Enter, RevealLines } from "./Reveal";
import BrandMark from "./BrandMark";
import Monogram from "./Monogram";

/**
 * The 3D network is only pulled in when the hero is on screen — it is ~600 KB
 * of Three.js and must never sit on the critical path.
 */
const DataNetwork3D = dynamic(() => import("./DataNetwork3D"), {
  ssr: false,
  loading: () => null,
});

/** Hairline circuit substrate, SVG only, no WebGL. */
const CircuitField = dynamic(() => import("./CircuitField"), { ssr: false });

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-name"
      className="relative isolate min-h-[100svh] overflow-hidden pb-16 pt-28 sm:pb-24 lg:flex lg:items-center lg:pb-32 lg:pt-32"
    >
      {/* ---------------------------------------------------------------- *
       * Background layers, back to front:
       *  1. circuit substrate, very faint
       *  2. 3D data network, biased right so it backs the photograph
       *  3. copper wash top-right (the human thread)
       *  4. vignette to seat the type
       * ---------------------------------------------------------------- */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.22]">
          <CircuitField />
        </div>
        <div className="absolute inset-y-0 right-0 w-full opacity-70 lg:w-[62%]">
          <DataNetwork3D />
        </div>
        <div className="absolute inset-0 bg-copper-wash" />
        <div className="absolute inset-0 bg-vignette" />
      </div>

      <div className="container-bleed">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ---------------- Left: identity ---------------- */}
          <div className="lg:col-span-7 xl:col-span-7">
            <Enter duration={0.7} className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="pad-label pad-label--signal">
                <span className="status-dot" aria-hidden="true" />
                Système en ligne
              </span>
              <span className="font-mono text-micro uppercase text-ink-faint">
                {profile.location}
              </span>
            </Enter>

            {/* The name is the headline of the whole site. */}
            <h1
              id="hero-name"
              className="hero-title-glow mt-7 font-display font-bold uppercase text-display-lg break-words hyphens-none"
            >
              <RevealLines
                lines={["Pape", "Djibril", "SÉNE"]}
                mode="mount"
                accent="last"
                delay={0.08}
                duration={0.95}
              />
            </h1>

            <Enter
              as="p"
              delay={0.42}
              duration={0.8}
              className="mt-7 font-mono text-sm uppercase tracking-wide2 text-signal sm:text-base"
            >
              {profile.role}
            </Enter>

            <Enter
              delay={0.52}
              duration={0.8}
              className="mt-8 h-px w-full max-w-sm bg-line-strong"
            />

            <Enter
              as="p"
              delay={0.6}
              duration={0.8}
              className="mt-8 max-w-prose text-[0.975rem] leading-relaxed text-ink-muted"
            >
              {profile.valueProposition}
            </Enter>

            <Enter
              delay={0.7}
              duration={0.8}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link href="/#work" className="btn-primary btn-scan">
                <span className="scan-sweep" aria-hidden="true" />
                Voir les projets
              </Link>
              <Link href="/#contact" className="btn-ghost">
                Me contacter
              </Link>
            </Enter>
          </div>

          {/* ---------------- Right: the person ---------------- */}
          <Enter
            delay={0.3}
            duration={1.1}
            scale={0.97}
          className="relative mx-auto w-full max-w-[300px] sm:max-w-[340px] lg:col-span-5 lg:mx-0 lg:max-w-none lg:justify-self-end"
        >
          <div className="lg:flex lg:items-stretch lg:justify-end lg:gap-8 xl:gap-10">
            <SignalRail />

            <div className="lg:w-[360px] lg:shrink-0">
              <figure className="relative overflow-visible">
                  {/* Offset copper plate behind the photograph — a print mis-
                      registered by a hair. Purely graphic, no card, no shadow. */}
                  <div
                    aria-hidden="true"
                    className="absolute -bottom-3 -right-3 -z-10 h-full w-full border border-copper/35 sm:-bottom-4 sm:-right-4"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute -left-3 -top-3 -z-10 h-full w-full border border-signal/20 sm:-left-4 sm:-top-4"
                  />

                  <div className="relative overflow-hidden bg-base-raised">
                    <Image
                      src={media.hero.src}
                      alt={media.hero.alt}
                      width={media.hero.w}
                      height={media.hero.h}
                      // The hero is the LCP element: preloaded, not lazy, and
                      // served as WebP/AVIF by the image optimizer.
                      priority
                      sizes="(max-width: 640px) 300px, (max-width: 1024px) 340px, 360px"
                      className="aspect-[3/4] w-full object-cover"
                      style={{ objectPosition: media.hero.position }}
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base-deep/70 via-transparent to-transparent"
                    />
                  </div>

                  {/* Technical readout, seated on the photo's lower edge. */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-4 sm:p-5">
                    <span className="hud-panel !border-white/10 !bg-base-deep/70 !text-ink-muted">
                      {profile.role}
                    </span>
                    <span className="hud-panel !border-white/10 !bg-base-deep/70 !text-signal">
                      Dakar · SN
                    </span>
                  </div>
                </figure>

                {/* Brand signature: BAAYCODE as the mark of the work, not the
                    person's job title. */}
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-5">
                  <BrandMark size="md" className="text-ink" />
                  <Monogram size="xs" />
                </div>
                <p className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-ink-faint">
                  {brand.thesisFr} — {brand.thesis}
                </p>
              </div>
            </div>
          </Enter>
        </div>

        {/* ---------------- Stat band ---------------- */}
        <Enter
          as="dl"
          delay={0.85}
          duration={0.9}
          className="mt-16 grid grid-cols-2 border-t border-line sm:mt-20 md:grid-cols-4"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`border-b border-line py-6 pr-4 sm:py-7 md:border-b-0 ${
                i % 2 === 0 ? "border-r border-line pl-0" : "pl-5"
              } md:border-r md:pl-6 md:first:pl-0 md:last:border-r-0`}
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                {s.label}
              </dt>
              <dd className="mt-2 font-display text-2xl uppercase text-ink sm:text-3xl">
                {s.value}
              </dd>
            </div>
          ))}
        </Enter>
      </div>
    </section>
  );
}

/**
 * Signal rail — fills the negative space between the identity copy and the
 * portrait on wide screens. Its three stops mirror the three layers of the
 * work (web, IoT, cloud), so the gap reads as a system diagram rather than
 * dead air.
 */
function SignalRail() {
  const stops = [
    { index: "01", label: "Web" },
    { index: "02", label: "IoT" },
    { index: "03", label: "Cloud" },
  ];

  return (
    <div
      aria-hidden="true"
      className="hidden w-[128px] shrink-0 flex-col self-stretch py-2 xl:flex"
    >
      <span className="pad-label pad-label--signal">Signal</span>

      <div className="relative mt-5 flex flex-1 flex-col justify-between border-l border-line-strong pl-5">
        {stops.map((stop) => (
          <div key={stop.label} className="relative">
            <span className="absolute -left-[23px] top-1/2 h-[7px] w-[7px] -translate-y-1/2 rotate-45 border border-signal/70 bg-base" />
            <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint">
              {stop.index}
            </span>
            <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              {stop.label}
            </span>
          </div>
        ))}
      </div>

      <span className="mt-5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-ink-faint">
        Du capteur
        <br />
        au cloud
      </span>
    </div>
  );
}
