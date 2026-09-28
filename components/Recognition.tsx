"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { distinctions, type Distinction, type DistinctionDoc } from "@/lib/data";
import { getMedia } from "@/lib/media";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";

/**
 * "Recognition" — the distinctions, presented with the original documents.
 *
 * Certificates are treated as physical objects: a slight tilt, a hairline
 * frame, a lift and a light sweep on hover, and a click to open the document at
 * full size. The images are the documents as delivered — never cropped, never
 * retouched, never relabelled.
 *
 * Distinctions without a document on hand (Orange Summer Challenge, Hackathon
 * MIABE) are still listed, with a note that the supporting document isn't in
 * the set rather than a substitute image.
 */
export default function Recognition() {
  const reduce = useReducedMotion();
  const [view, setView] = useState<{
    item: Distinction;
    doc: DistinctionDoc;
  } | null>(null);

  return (
    <section
      id="recognition"
      aria-labelledby="recognition-heading"
      className="section-y relative border-t border-line bg-base-deep"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-copper-wash opacity-80"
      />

      <div className="container-bleed relative">
        <SectionHead
          headingId="recognition-heading"
          eyebrow="Recognition"
          heading={["Distinctions"]}
          lede="Quatre distinctions en 2025. Les documents ci-dessous sont les originaux — cliquez pour les agrandir."
          aside="2025"
          accent="copper"
          headingClassName="text-display-md"
        />

        <ul className="mt-14 grid gap-10 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {distinctions.map((d, i) => (
            <DistinctionCard
              key={d.id}
              item={d}
              delay={i * 0.07}
              reduce={!!reduce}
              onOpen={(doc) => setView({ item: d, doc })}
            />
          ))}
        </ul>
      </div>

      <DocViewer
        item={view?.item ?? null}
        doc={view?.doc ?? null}
        onClose={() => setView(null)}
      />
    </section>
  );
}

function DistinctionCard({
  item,
  delay,
  reduce,
  onOpen,
}: {
  item: Distinction;
  delay: number;
  reduce: boolean;
  onOpen: (doc: DistinctionDoc) => void;
}) {
  return (
    <Reveal as="li" delay={delay} duration={0.65} className="h-full">
      <motion.article
        whileHover={reduce ? undefined : { y: -4 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="group flex h-full flex-col"
      >
        {/* --- The documents, as objects on a table --- */}
        {item.docs.length > 0 ? (
          <ul
            className={
              item.docs.length > 1 ? "grid grid-cols-2 gap-3" : undefined
            }
          >
            {item.docs.map((doc) => {
              const media = getMedia(doc.key);
              return (
                <li key={doc.key}>
                  <button
                    type="button"
                    onClick={() => onOpen(doc)}
                    aria-label={`Agrandir le document : ${item.org}, ${item.result} — ${doc.label}`}
                    className="sheen relative block w-full cursor-zoom"
                    style={{ transform: `rotate(${doc.tilt}deg)` }}
                  >
                    <div className="relative overflow-hidden border border-line-strong bg-base-raised shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] transition-shadow duration-500 group-hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.95)]">
                      <Image
                        src={media.src}
                        alt={media.alt}
                        width={media.w}
                        height={media.h}
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="aspect-[3/4] w-full object-cover object-top transition-transform duration-[1000ms] ease-editorial group-hover:scale-[1.04]"
                        style={{ objectPosition: media.position ?? "50% 0%" }}
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"
                      />
                    </div>
                    <span className="sr-only">
                      Ouvrir {doc.label} en grand
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          /* No document on hand: a typographic plate, not a substitute image. */
          <div className="relative flex aspect-[3/4] w-full items-end border border-line bg-base-raised p-5">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-grid bg-[size:26px_26px] opacity-40"
            />
            <div className="relative">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                Document à venir
              </span>
              <p className="mt-2 text-sm leading-snug text-ink-muted">
                {item.note}
              </p>
            </div>
          </div>
        )}

        {/* --- Caption --- */}
        <div className="mt-6 flex-1 border-t border-line pt-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              {item.year}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-copper">
              {item.result}
            </span>
          </div>

          <h3 className="mt-3 font-display text-lg uppercase leading-tight text-ink transition-colors duration-300 group-hover:text-copper">
            {item.org}
          </h3>

          {item.location && (
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
              {item.location}
            </p>
          )}

          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
            {item.project}
          </p>

          {item.docs.length > 0 && item.note && (
            <p className="mt-3 text-xs leading-relaxed text-ink-faint">
              {item.note}
            </p>
          )}
        </div>
      </motion.article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ *
 * Full-size document viewer
 * ------------------------------------------------------------------ */

function DocViewer({
  item,
  doc,
  onClose,
}: {
  item: Distinction | null;
  doc: DistinctionDoc | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  const open = item !== null && doc !== null;
  const media = doc ? getMedia(doc.key) : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label={item ? `Document : ${item.org}` : "Document"}
      className="modal-root m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-transparent"
    >
      <AnimatePresence>
        {open && item && doc && media && (
          <motion.figure
            key={doc.key}
            initial={reduce ? undefined : { opacity: 0, y: 12 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="modal-panel"
          >
            <div className="mx-auto w-fit max-w-full border border-line-strong bg-base-raised shadow-[0_40px_90px_-40px_rgba(0,0,0,1)]">
              <Image
                src={media.src}
                alt={media.alt}
                width={media.w}
                height={media.h}
                sizes="(max-width: 1024px) 94vw, 860px"
                className="max-h-[72vh] w-auto object-contain"
              />
            </div>

            <figcaption className="mx-auto mt-5 max-w-2xl border-t border-line pt-4">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  {item.year}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper">
                  {item.result}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink">{item.org}</p>
              {doc.label && (
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-copper">
                  {doc.label}
                </p>
              )}
              {item.note && (
                <p className="mt-1 text-xs leading-relaxed text-ink-faint">
                  {item.note}
                </p>
              )}
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                Document original — non modifié
              </p>
            </figcaption>
          </motion.figure>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer le document"
        className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center border border-line-strong bg-base/80 text-ink transition-colors hover:border-copper hover:text-copper sm:right-5 sm:top-5"
      >
        <X size={20} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </dialog>
  );
}
