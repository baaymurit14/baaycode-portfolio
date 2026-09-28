"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { education, involvements, story } from "@/lib/data";
import { media } from "@/lib/media";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";

/**
 * "My Story" — editorial two-column composition.
 *
 * Left: the narrative, set as a magazine column with a hanging index and a
 * pull-fact block.
 * Right: the black & white portrait, treated as a printed plate rather than a
 * card — hairline frame, slight rotation, grain, and a slow parallax so it sits
 * on a different plane from the text.
 *
 * No card, no rounded corners, no drop shadow: the section has to read as a
 * magazine spread.
 */
export default function MyStory() {
  const reduce = useReducedMotion();
  const photoRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ["start end", "end start"],
  });

  // Very light parallax — enough to feel like depth, not enough to distract.
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [34, -34]);
  const rotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [1.4, -1.4]);

  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="section-y relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full bg-signal-wash opacity-70 lg:w-1/2"
      />

      <div className="container-bleed relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16 xl:gap-24">
          {/* ================= Story column ================= */}
          <div className="lg:col-span-6 xl:col-span-5">
            <SectionHead
              headingId="story-heading"
              eyebrow={story.eyebrow}
              heading={story.heading}
              accent="copper"
              headingClassName="text-display-md"
            />

            <div className="mt-10 space-y-6">
              {story.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className="prose-body first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[3.25rem] first-letter:leading-[0.78] first-letter:text-copper">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Pull facts — the "at a glance" strip of a printed profile. */}
            <Reveal delay={0.1}>
              <dl className="mt-12 divide-y divide-line border-y border-line">
                {story.facts.map((f) => (
                  <div
                    key={f.label}
                    className="grid grid-cols-[7.5rem_1fr] gap-4 py-4 sm:grid-cols-[9rem_1fr]"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                      {f.label}
                    </dt>
                    <dd className="text-sm text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* Education & involvement, kept terse. */}
            <Reveal delay={0.14}>
              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper">
                    Formation
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {education.map((e) => (
                      <li key={e.title} className="text-sm leading-snug text-ink-muted">
                        {e.title}
                        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                          {e.place}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper">
                    Engagements
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {involvements.map((e) => (
                      <li key={e.org} className="text-sm leading-snug text-ink-muted">
                        {e.org}
                        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                          {e.role}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ================= Portrait plate ================= */}
          <div className="lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7">
            <div className="lg:sticky lg:top-28">
              <figure className="relative">
                {/* Running text down the left edge of the plate. */}
                <span
                  aria-hidden="true"
                  className="vertical-label absolute -left-8 top-0 hidden lg:block"
                >
                  {story.marginNotes.join("  ·  ")}
                </span>

                <motion.div
                  ref={photoRef}
                  style={{ y, rotate }}
                  className="relative"
                >
                  {/* Off-register print plate behind the photo. */}
                  <div
                    aria-hidden="true"
                    className="absolute -bottom-4 -left-4 -z-10 h-full w-full border border-copper/30 sm:-bottom-6 sm:-left-6"
                  />

                  <div className="bw-editorial relative overflow-hidden bg-base-raised">
                    <Image
                      src={media.story.src}
                      alt={media.story.alt}
                      width={media.story.w}
                      height={media.story.h}
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="aspect-[3/4] w-full object-cover sm:aspect-[4/5]"
                      style={{ objectPosition: media.story.position }}
                    />
                    {/* Grain + paper cast, composited over the monochrome plate. */}
                    <div className="grain-heavy" aria-hidden="true" />
                    <div className="paper-cast" aria-hidden="true" />
                  </div>

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 border border-line-strong"
                  />
                </motion.div>

                <figcaption className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-line pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper">
                    {story.eyebrow}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {media.story.src.split("/").pop()}
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
