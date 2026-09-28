"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { journey, type JourneyStop } from "@/lib/data";
import { getMedia, type MediaIndexKey } from "@/lib/media";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";

/**
 * "The Journey" — a visual timeline.
 *
 * A single hairline runs down the left; it draws itself as the visitor scrolls.
 * Each stop hangs off it, alternating the supporting photograph left/right on
 * desktop so the column never becomes a single monotonous stack.
 *
 * Dates are shown only where lib/data.ts has a verified year. Undated stops
 * render the label alone — no guess, no placeholder year.
 */

const KIND_LABEL: Record<JourneyStop["kind"], string> = {
  education: "Formation",
  project: "Projet",
  competition: "Compétition",
  recognition: "Distinction",
  now: "Aujourd'hui",
  next: "Suite",
};

const KIND_ACCENT: Record<JourneyStop["kind"], "copper" | "signal" | "ink"> = {
  education: "ink",
  project: "signal",
  competition: "signal",
  recognition: "copper",
  now: "copper",
  next: "ink",
};

export default function Journey() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.75", "end 0.6"],
  });

  const threadScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1]);

  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="section-y relative border-t border-line"
    >
      <div className="container-bleed">
        <SectionHead
          headingId="journey-heading"
          eyebrow="The Journey"
          heading={["Le", "parcours"]}
          lede="Du baccalauréat aux systèmes IoT connectés. Les dates marquées sont vérifiées ; les étapes non datées le restent, sans approximation."
          accent="copper"
          headingClassName="text-display-md"
        />

        <ol ref={listRef} className="relative mt-16 sm:mt-24">
          {/* Base hairline + the drawn progress on top of it. */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 hidden h-full w-px bg-line lg:block"
          />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: threadScale }}
            className="absolute left-0 top-0 hidden h-full w-px origin-top bg-gradient-to-b from-copper/80 via-copper/45 to-signal/40 lg:block"
          />

          {journey.map((stop, i) => (
            <JourneyRow key={stop.id} stop={stop} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function JourneyRow({
  stop,
  index,
}: {
  stop: JourneyStop;
  index: number;
}) {
  const media = stop.media
    ? getMedia(stop.media as MediaIndexKey)
    : null;

  const accent = KIND_ACCENT[stop.kind];
  const dotColor =
    accent === "copper"
      ? "bg-copper"
      : accent === "signal"
        ? "bg-signal"
        : "bg-ink-faint";

  // Alternate sides on desktop; the photo flips to keep the text in the
  // outside column.
  const flip = index % 2 === 1;

  return (
    <li className="relative">
      {/* The rows fade up as the thread reaches them. Deliberately not a
          scroll-linked opacity: that ships a 0.25 base in the server HTML,
          which leaves the whole timeline barely legible without JS. The
          scroll-linked element of this section is the thread itself. */}
      <Reveal
        className="relative pb-12 pl-8 last:pb-0 sm:pl-10 lg:grid lg:grid-cols-12 lg:gap-12 lg:pb-16 lg:pl-0"
        delay={Math.min(index, 4) * 0.05}
      >
        {/* Node on the thread. */}
        <span
          aria-hidden="true"
          className={`absolute left-0 top-2 z-10 h-2.5 w-2.5 -translate-x-[1px] lg:left-0 ${
            stop.current ? `${dotColor} ring-4 ring-copper/15` : dotColor
          }`}
        />
        {stop.current && (
          <span
            aria-hidden="true"
            className="absolute left-0 top-2 z-10 h-2.5 w-2.5 -translate-x-[1px] origin-center motion-safe:animate-ringExpand lg:left-0"
          >
            <span className={`block h-2.5 w-2.5 ${dotColor}`} />
          </span>
        )}

        {/* Text block */}
        <div
          className={
            flip
              ? "lg:col-span-5 lg:col-start-8 lg:pl-4"
              : "lg:col-span-5 lg:col-start-2"
          }
        >
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            {/* Year only when verified. */}
            <span
              className={`font-mono text-[11px] uppercase tracking-[0.2em] ${
                stop.year ? "text-copper" : "text-ink-faint"
              }`}
            >
              {stop.year ?? "—"}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              {KIND_LABEL[stop.kind]}
            </span>
            {stop.current && (
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-copper">
                Position actuelle
              </span>
            )}
          </div>

          <h3
            className={`mt-3 font-display text-2xl uppercase leading-tight sm:text-3xl ${
              stop.kind === "next" ? "text-signal" : "text-ink"
            }`}
          >
            {stop.title}
          </h3>

          {stop.place && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
              {stop.place}
            </p>
          )}

          <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-muted">
            {stop.line}
          </p>
        </div>

        {/* Supporting photograph, on the outer side. */}
        {media && (
          <figure
            className={
              flip
                ? "mt-6 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0"
                : "mt-6 lg:col-span-4 lg:col-start-9 lg:mt-0"
            }
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-base-raised">
              <Image
                src={media.src}
                alt={media.alt}
                width={media.w}
                height={media.h}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 32vw"
                className="h-full w-full object-cover opacity-85"
                style={{ objectPosition: media.position }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/50 to-transparent"
              />
            </div>
          </figure>
        )}

        {/* Without a photo, the row keeps its full measure. */}
        {!media && (
          <div aria-hidden="true" className="hidden lg:col-span-4 lg:block" />
        )}
      </Reveal>
    </li>
  );
}
