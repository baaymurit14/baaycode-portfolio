"use client";

import { motion, useReducedMotion } from "framer-motion";
import { whatIBuild } from "@/lib/data";
import { getMedia } from "@/lib/media";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";
import BuildGlyph from "./BuildGlyph";
import Image from "next/image";

/**
 * "What I Build" — five categories, each with its own animated diagram, a short
 * line, and the technologies involved.
 *
 * Deliberately not a skills bar chart. The point is to show the shape of the
 * work, not to score it.
 */
export default function WhatIBuild() {
  const reduce = useReducedMotion();

  return (
    <section
      id="build"
      aria-labelledby="build-heading"
      className="section-y relative border-t border-line"
    >
      <div className="container-bleed">
        <SectionHead
          headingId="build-heading"
          eyebrow="What I Build"
          heading={["Ce que", "je construis"]}
          lede="Cinq familles de projets. Chacune a sa forme, ses contraintes et sa chaîne technique — et chacune existe déjà dans un projet livré."
          aside={`${String(whatIBuild.length).padStart(2, "0")} axes`}
          accent="signal"
          headingClassName="text-display-md"
        />

        <ul className="mt-14 grid gap-px border border-line bg-line sm:mt-20 lg:grid-cols-2 xl:grid-cols-3">
          {whatIBuild.map((cat, i) => (
            <BuildCard
              key={cat.id}
              cat={cat}
              delay={i * 0.07}
              reduce={!!reduce}
              /** The first card runs full width on large screens so the grid
               *  reads as a magazine spread, not a uniform table. */
              wide={i === 0}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function BuildCard({
  cat,
  delay,
  reduce,
  wide,
}: {
  cat: (typeof whatIBuild)[number];
  delay: number;
  reduce: boolean;
  wide: boolean;
}) {
  const accent =
    cat.accent === "copper"
      ? {
          text: "text-copper",
          border: "group-hover:border-copper/45",
          chip: "text-copper border-copper/25",
        }
      : {
          text: "text-signal",
          border: "group-hover:border-signal/45",
          chip: "text-signal border-signal/25",
        };

  // Two supporting photographs, chosen so the section doesn't feel like a
  // wall of text. Only used on the wide card to keep the grid calm.
  const photo = wide
    ? cat.id === "iot"
      ? getMedia("bench1")
      : getMedia("presentationKaaraange")
    : null;

  return (
    <li
      className={`bg-base ${wide ? "lg:col-span-2 xl:col-span-2" : ""}`}
    >
      <Reveal delay={delay} duration={0.65} className="h-full">
        <motion.article
          whileHover={reduce ? undefined : { y: -3 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className={`group relative flex h-full flex-col border border-transparent p-7 transition-colors duration-400 sm:p-8 ${accent.border}`}
        >
          <div className="flex items-start justify-between gap-6">
            <div className="relative h-16 w-16 shrink-0 sm:h-20 sm:w-20">
              <BuildGlyph glyph={cat.glyph} accent={cat.accent} />
            </div>
            <span className="font-mono text-[10px] tracking-[0.2em] text-ink-faint">
              {cat.index}
            </span>
          </div>

          <h3 className="mt-7 font-display text-2xl uppercase leading-none text-ink sm:text-[1.75rem]">
            {cat.title}
          </h3>
          <p className={`mt-2 font-mono text-[10px] uppercase tracking-[0.2em] ${accent.text}`}>
            {cat.fr}
          </p>

          <p className="mt-5 text-sm font-medium text-ink">{cat.line}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{cat.detail}</p>

          {photo && (
            <div className="relative mt-7 aspect-[16/9] w-full overflow-hidden bg-base-raised">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.w}
                height={photo.h}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-full w-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                style={{ objectPosition: photo.position }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base via-base/20 to-transparent"
              />
            </div>
          )}

          <ul className={`mt-7 flex flex-wrap gap-2 ${photo ? "mt-auto pt-7" : "mt-auto pt-7"}`}>
            {cat.stack.map((tech) => (
              <li
                key={tech}
                className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted transition-colors duration-300 ${accent.chip}`}
              >
                {tech}
              </li>
            ))}
          </ul>
        </motion.article>
      </Reveal>
    </li>
  );
}
