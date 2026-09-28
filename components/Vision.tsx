"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { brand, vision } from "@/lib/data";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";
import BrandMark from "./BrandMark";

/** The circuit substrate returns here, at very low contrast, as a backdrop. */
const CircuitField = dynamic(() => import("./CircuitField"), { ssr: false });

export default function Vision() {
  const reduce = useReducedMotion();

  return (
    <section
      id="vision"
      aria-labelledby="vision-heading"
      className="section-y relative overflow-hidden border-t border-line"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.14]">
        <CircuitField />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-signal-wash"
      />

      <div className="container-bleed relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHead
              headingId="vision-heading"
              eyebrow={vision.eyebrow}
              heading={vision.heading}
              accent="signal"
              headingClassName="text-display-md"
            />

            <Reveal delay={0.14}>
              <p className="lede mt-9">{vision.body}</p>
            </Reveal>

            {/* Explicit framing: a direction, not a title already held. */}
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-prose border-l-2 border-signal/40 pl-5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-ink-faint">
                {vision.disclaimer}
              </p>
            </Reveal>
          </div>

          {/* --- The three axes --- */}
          <div className="lg:col-span-6 lg:pt-4">
            <ul className="border-t border-line">
              {vision.axes.map((axis, i) => (
                <Reveal as="li" key={axis.id} delay={0.1 + i * 0.1} duration={0.65}>
                  <motion.div
                    whileHover={reduce ? undefined : { x: 6 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 border-b border-line py-7 sm:gap-x-10 sm:py-9"
                  >
                    <span className="font-mono text-[10px] tracking-[0.2em] text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl uppercase leading-none text-ink transition-colors duration-300 group-hover:text-signal sm:text-3xl">
                        {axis.label}
                      </h3>
                      <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-muted">
                        {axis.line}
                      </p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </ul>

            {/* Closing brand statement — the thesis, restated as a signature. */}
            <Reveal delay={0.3}>
              <div className="mt-14 flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="font-mono text-micro uppercase text-ink-faint">
                    {brand.tagline}
                  </p>
                  <BrandMark
                    as="p"
                    size="lg"
                    className="mt-3 text-ink transition-colors duration-500 hover:text-copper"
                  />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                  {brand.person}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
