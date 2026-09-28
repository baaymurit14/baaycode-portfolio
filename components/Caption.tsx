import type { MediaItem } from "@/lib/media";

/**
 * Editorial caption block. Pairs a running head (mono, tracked) with a short
 * line of context — the "photo credit" strip of a printed page.
 */
export default function Caption({
  media,
  context,
  text,
  accent = "signal",
  className = "",
}: {
  media?: Pick<MediaItem, "src">;
  context?: string;
  text: string;
  accent?: "copper" | "signal";
  className?: string;
}) {
  return (
    <figcaption
      className={`mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 ${className}`}
    >
      {context && (
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
            accent === "copper" ? "text-copper" : "text-signal"
          }`}
        >
          {context}
        </span>
      )}
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
        {text}
      </span>
    </figcaption>
  );
}
