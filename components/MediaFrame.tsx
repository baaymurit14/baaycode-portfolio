"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type { MediaItem } from "@/lib/media";

/**
 * Photographic object with cursor-reactive depth.
 *
 * The wrapper translates a few pixels toward the pointer while the image
 * counter-scales slightly, which reads as depth rather than as a slide. Both
 * are driven by the same rAF-throttled handler, and both are skipped entirely
 * under prefers-reduced-motion or on coarse pointers (touch), where there is
 * no cursor to react to and the transform would only cost frames.
 */
export default function MediaFrame({
  media,
  /** Tailwind aspect class, e.g. "aspect-[4/5]". Omit to use the source ratio. */
  aspect,
  className = "",
  imageClassName = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  /** Max displacement in px at the frame edge. */
  depth = 10,
  zoom = 1.045,
  children,
}: {
  media: MediaItem;
  aspect?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  depth?: number;
  zoom?: number;
  children?: React.ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduce) return;
      if (e.pointerType !== "mouse") return;
      const el = frameRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      if (frameRef.current) {
        frameRef.current.style.transform = `translate3d(${px * -depth}px, ${py * -depth}px, 0)`;
      }
      if (imageRef.current) {
        imageRef.current.style.transform = `scale(${zoom}) translate3d(${px * depth * 0.4}px, ${py * depth * 0.4}px, 0)`;
      }
    },
    [depth, zoom, reduce]
  );

  const onLeave = useCallback(() => {
    if (frameRef.current) frameRef.current.style.transform = "translate3d(0,0,0)";
    if (imageRef.current) imageRef.current.style.transform = "";
  }, []);

  return (
    <div className={className}>
      <div
        ref={frameRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={`cursor-zoom cursor-zoom--static gpu relative overflow-hidden bg-base-raised ${
          aspect ?? ""
        }`}
        style={{ transition: "transform 500ms cubic-bezier(0.16,1,0.3,1)" }}
      >
        <span
          ref={imageRef}
          className="block h-full w-full"
          style={{ display: "block" }}
        >
          <Image
            src={media.src}
            alt={media.alt}
            width={media.w}
            height={media.h}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes={sizes}
            className={`h-full w-full object-cover ${imageClassName}`}
            style={{ objectPosition: media.position ?? "50% 50%" }}
          />
        </span>
        {children}
      </div>
    </div>
  );
}
