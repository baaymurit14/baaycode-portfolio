"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { brand, narrative } from "@/lib/data";
import Marquee from "./Marquee";

/**
 * The narrative spine.
 *
 * Establishes the six movements of the page — Person → Builder → Projects →
 * Innovation → Recognition → Vision — as a contents page, then holds the active
 * one as the visitor scrolls. This is what turns a portfolio into a journey.
 *
 * Implementation note: the active step is driven by a single scroll listener
 * writing to a ref-backed state, and only the active row animates. No layout
 * properties are animated, so the thread never causes reflow.
 */
export default function Manifesto() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // The thread that runs down the left of the list.
  const threadScale = useTransform(scrollYProgress, [0.08, 0.72], [0, 1]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="manifesto-heading"
      className="relative border-y border-line bg-base-deep"
    >
      <div className="substrate absolute inset-0 opacity-50" aria-hidden="true" />

      <div className="container-bleed relative py-20 sm:py-28 lg:py-32">
        {/* ---------------- Thesis ---------------- */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <span className="pad-label pad-label--copper">La thèse</span>
            <h2
              id="manifesto-heading"
              className="mt-6 font-display text-display-md uppercase text-ink sm:text-display-lg"
            >
              <span className="block text-ink-faint">From ideas</span>
              <span className="block text-copper">to systems</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pb-3">
            <p className="lede">
              {brand.mark} est l&apos;univers. {brand.person} est la personne
              derrière. Ce site raconte le chemin de l&apos;une à l&apos;autre —
              six mouvements, du premier formulaire Web jusqu&apos;aux systèmes
              IoT connectés.
            </p>
          </div>
        </div>

        <Marquee
          items={[
            "Web",
            "IoT",
            "Cloud",
            "Systèmes intelligents",
            "Innovation",
          ]}
          accent="copper"
          reverse
          className="mt-14 border-y border-line py-6 sm:mt-20 sm:py-8"
        />

        {/* ---------------- The six movements ---------------- */}
        <ol className="mt-16 sm:mt-24">
          {narrative.map((step, i) => (
            <NarrativeRow
              key={step.id}
              step={step}
              index={i}
              isLast={i === narrative.length - 1}
              thread={threadScale}
              reduce={!!reduce}
            />
          ))}
        </ol>

        <p className="mt-16 max-w-prose font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink-faint">
          Chaque mouvement est une section. Faites défiler — le fil à gauche
          suit votre progression.
        </p>
      </div>
    </section>
  );
}

function NarrativeRow({
  step,
  index,
  isLast,
  thread,
  reduce,
}: {
  step: (typeof narrative)[number];
  index: number;
  isLast: boolean;
  thread: ReturnType<typeof useTransform<number, number>>;
  reduce: boolean;
}) {
  const rowRef = useRef<HTMLLIElement>(null);

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 0.85", "start 0.35"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.3, 1]);
  const x = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-18, 0]);

  // The vertical thread is drawn on the first row only, scaled by page progress.
  const isFirst = index === 0;

  return (
    <li ref={rowRef} className="relative">
      <motion.div
        style={{ opacity, x }}
        className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 border-t border-line py-7 sm:gap-x-8 sm:py-9 lg:grid-cols-[auto_auto_1fr] lg:gap-x-12"
      >
        <span className="font-mono text-[10px] tracking-[0.2em] text-ink-faint">
          {step.index}
        </span>

        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint lg:hidden">
          {step.fr}
        </span>

        <span className="col-start-2 lg:col-start-3">
          <span className="block font-display text-3xl uppercase leading-none text-ink transition-colors duration-300 group-hover:text-copper sm:text-4xl lg:text-5xl">
            {step.label}
          </span>
          <span className="mt-3 hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint lg:block">
            {step.fr}
          </span>
          <span className="mt-3 block max-w-prose text-sm leading-relaxed text-ink-muted">
            {step.line}
          </span>
        </span>
      </motion.div>

      {/* Thread overlay, only on the first row so it isn't repeated. */}
      {isFirst && !isLast && (
        <motion.span
          aria-hidden="true"
          style={{ scaleY: thread }}
          className="absolute left-0 top-0 hidden h-full w-px origin-top bg-gradient-to-b from-copper/70 via-copper/40 to-transparent lg:block"
        />
      )}
    </li>
  );
}
