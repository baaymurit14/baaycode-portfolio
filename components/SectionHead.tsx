import Reveal, { RevealLines } from "./Reveal";

/**
 * Standard section opening: running head, oversized display title, optional
 * lede. Used by every movement of the page so the rhythm stays consistent while
 * the content changes.
 */
export default function SectionHead({
  id,
  headingId,
  eyebrow,
  heading,
  lede,
  aside,
  accent = "copper",
  accentLines = "last",
  align = "left",
  className = "",
  headingClassName = "",
}: {
  /** Anchor id, when the head itself is the nav target. */
  id?: string;
  /** Id for the <h2>, referenced by the section's aria-labelledby. */
  headingId?: string;
  eyebrow: string;
  /** One array item per line. */
  heading: readonly string[];
  lede?: string;
  /** Small right-aligned note, e.g. a count or a date range. */
  aside?: string;
  accent?: "copper" | "signal";
  /** Which heading lines are set in copper. Defaults to the final line. */
  accentLines?: "none" | "all" | "last";
  align?: "left" | "between";
  className?: string;
  headingClassName?: string;
}) {
  const isBetween = align === "between" && !!aside;

  return (
    <div className={className} id={id}>
      <Reveal direction="none" duration={0.6}>
        <div
          className={`flex flex-wrap items-baseline gap-x-8 gap-y-3 ${
            isBetween ? "justify-between" : ""
          }`}
        >
          <span className={`pad-label pad-label--${accent}`}>{eyebrow}</span>
          {aside && (
            <span className="font-mono text-micro uppercase text-ink-faint">
              {aside}
            </span>
          )}
        </div>
      </Reveal>

      <h2 id={headingId}>
        <RevealLines
          lines={heading}
          className={`display-heading mt-7 ${headingClassName}`}
          accent={accentLines}
        />
      </h2>

      {lede && (
        <Reveal delay={0.12}>
          <p className="lede mt-8 max-w-prose">{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
