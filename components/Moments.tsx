"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { moments, type Moment } from "@/lib/data";
import { getMedia, type MediaIndexKey } from "@/lib/media";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";
import Lightbox from "./Lightbox";

/**
 * "Moments" — a curated editorial grid, not an album.
 *
 * Seven frames with deliberately mixed weights (one wide, two tall, the rest
 * standard) so the page reads as a magazine spread. Only seven of the available
 * photographs are used: curated, not crowded.
 *
 * On mobile the mixed spans collapse to a single column, because a masonry
 * layout at 375px is unreadable and the storytelling matters more than the
 * rhythm.
 */
export default function Moments() {
  const reduce = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const navigate = useCallback((next: number) => setOpenIndex(next), []);

  const spans: Record<Moment["span"], string> = {
    wide: "sm:col-span-2 lg:col-span-2",
    tall: "sm:row-span-2",
    std: "",
  };

  const ratios: Record<Moment["span"], string> = {
    wide: "aspect-[16/10] sm:aspect-[16/9]",
    tall: "aspect-[4/5] sm:aspect-auto sm:h-full",
    std: "aspect-[4/3]",
  };

  return (
    <section
      id="moments"
      aria-labelledby="moments-heading"
      className="section-y relative border-t border-line bg-base-deep"
    >
      <div className="container-bleed">
        <SectionHead
          headingId="moments-heading"
          eyebrow="Behind the Build"
          heading={["Moments"]}
          lede="Le travail réel : les benches, les démonstrations, les présentations, les équipes. Quelques fragments, choisis."
          aside={`${moments.length} fragments`}
          accent="signal"
          headingClassName="text-display-md"
        />

        {/* Auto-rows let the "tall" frames span two rows without a masonry
            library, which keeps the grid keyboard- and screen-reader-friendly. */}
        <div className="mt-14 grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-3 sm:mt-20 sm:grid-cols-2 sm:grid-rows-[repeat(6,minmax(0,1fr))] sm:gap-4 lg:grid-cols-4">
          {moments.map((moment, i) => {
            const media = getMedia(moment.media as MediaIndexKey);
            const isTall = moment.span === "tall";

            return (
              <Reveal
                key={moment.id}
                delay={(i % 3) * 0.08}
                duration={0.65}
                className={`${spans[moment.span]} ${
                  // The two tall frames get an explicit row span on sm+.
                  isTall ? "sm:row-span-2" : ""
                }`}
              >
                <motion.button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  whileHover={reduce ? undefined : { y: -3 }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                  aria-label={`Agrandir : ${moment.caption}`}
                  className="group relative block h-full w-full overflow-hidden bg-base-raised text-left"
                >
                  <Image
                    src={media.src}
                    alt={media.alt}
                    width={media.w}
                    height={media.h}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`h-full w-full object-cover ${ratios[moment.span]} transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.06]`}
                    style={{ objectPosition: media.position }}
                  />

                  {/* Legibility scrim, stronger at the bottom. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base-deep/85 via-base-deep/10 to-transparent"
                  />

                  {/* Frame drawn on hover — reads as a contact print. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-white/20"
                  />

                  {/* Context strip, always present so the caption is not
                      hover-only (which would be invisible on touch). */}
                  <span className="absolute left-0 top-0 flex items-center gap-2 p-3 sm:p-4">
                    <span
                      className={`h-[5px] w-[5px] ${
                        moment.accent === "copper" ? "bg-copper" : "bg-signal"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/85">
                      {moment.context}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.16em] text-ink/45">
                      {moment.date}
                    </span>
                  </span>

                  <span className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-3 sm:p-4">
                    <span className="font-display text-base uppercase leading-tight text-ink sm:text-lg">
                      {moment.caption}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 translate-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      Voir
                    </span>
                  </span>
                </motion.button>
              </Reveal>
            );
          })}
        </div>
      </div>

      <Lightbox
        items={moments}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={navigate}
      />
    </section>
  );
}
