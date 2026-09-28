"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getMedia, type MediaIndexKey } from "@/lib/media";
import type { Moment } from "@/lib/data";

/**
 * Full-screen viewer for the Moments gallery.
 *
 * Implemented as a native <dialog> so focus trapping, Escape-to-close and the
 * top layer come from the platform. Body scroll is locked while open, the
 * backdrop closes on click, and arrow keys move between frames.
 *
 * Only the selected image is mounted, so opening a large photo never pulls the
 * whole gallery into memory.
 */
export default function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: Moment[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  const open = index !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Lock the page behind the dialog.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onNavigate((index + 1) % items.length);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onNavigate((index - 1 + items.length) % items.length);
      }
    },
    [index, items.length, onNavigate]
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onKey]);

  const current = index === null ? null : items[index];
  const media = current ? getMedia(current.media as MediaIndexKey) : null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        // A click that lands on the dialog element itself is a backdrop click;
        // clicks inside the panel bubble up from a child instead.
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label="Aperçu de la photo"
      className="modal-root m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-transparent"
    >
      <AnimatePresence>
        {open && media && current && (
          <motion.div
            key={current.id}
            initial={reduce ? undefined : { opacity: 0, scale: 0.985 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="modal-panel"
          >
            <figure className="relative">
              <div className="relative mx-auto max-h-[76vh] w-fit overflow-hidden bg-base-raised">
                <Image
                  src={media.src}
                  alt={media.alt}
                  width={media.w}
                  height={media.h}
                  sizes="(max-width: 1024px) 96vw, 1100px"
                  className="max-h-[76vh] w-auto object-contain"
                />
              </div>

              <figcaption className="mx-auto mt-5 flex max-w-2xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-line pt-4">
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                    current.accent === "copper" ? "text-copper" : "text-signal"
                  }`}
                >
                  {current.context}
                </span>
                <span className="text-sm text-ink-muted">{current.caption}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                  {current.date} — {(index ?? 0) + 1}/{items.length}
                </span>
              </figcaption>
            </figure>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls sit outside the animated panel so they don't re-mount. */}
      {open && items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => index !== null && onNavigate((index - 1 + items.length) % items.length)}
            aria-label="Photo précédente"
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-line-strong bg-base/80 text-ink transition-colors hover:border-signal hover:text-signal sm:left-5"
          >
            <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => index !== null && onNavigate((index + 1) % items.length)}
            aria-label="Photo suivante"
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-line-strong bg-base/80 text-ink transition-colors hover:border-signal hover:text-signal sm:right-5"
          >
            <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </>
      )}

      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer l'aperçu"
        className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center border border-line-strong bg-base/80 text-ink transition-colors hover:border-copper hover:text-copper sm:right-5 sm:top-5"
      >
        <X size={20} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </dialog>
  );
}
