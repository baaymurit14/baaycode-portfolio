"use client";

/**
 * Infinite brand ticker.
 *
 * The track holds the phrase exactly twice and translates by -50%, so the loop
 * is seamless without measuring anything. Rendered as one continuous string
 * rather than per-word elements to keep the DOM small on mobile.
 */
export default function Marquee({
  items,
  separator = "·",
  accent = "copper",
  className = "",
  reverse = false,
}: {
  items: readonly string[];
  separator?: string;
  accent?: "copper" | "signal" | "ink";
  className?: string;
  reverse?: boolean;
}) {
  const run = items.join(`  ${separator}  `);
  const accents = {
    copper: "text-copper",
    signal: "text-signal",
    ink: "text-ink-faint",
  } as const;

  return (
    <div
      className={`relative flex overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Feather the ends so the type enters and leaves rather than clipping. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-base to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-base to-transparent" />

      <div
        className={`flex w-max shrink-0 items-center gap-8 whitespace-nowrap ${
          reverse ? "animate-marquee [animation-direction:reverse]" : "animate-marquee"
        } motion-reduce:animate-none`}
      >
        {[0, 1].map((dup) => (
          <span
            key={dup}
            className={`font-display text-[2.6rem] font-bold uppercase leading-none tracking-[0.02em] sm:text-6xl lg:text-7xl ${accents[accent]}`}
          >
            {run}
            <span className="px-8 text-ink-faint/60">{separator}</span>
          </span>
        ))}
      </div>

      {/* The same text, available to assistive tech and to search engines. */}
      <span className="sr-only">{items.join(", ")}</span>
    </div>
  );
}
