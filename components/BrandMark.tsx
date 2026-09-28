import { brand } from "@/lib/data";

/**
 * The BAAYCODE wordmark.
 *
 * Rendered as text with wide tracking rather than an SVG path: it stays crisp
 * at any size, scales with the fluid display type, and remains selectable by
 * screen readers. `as` lets the caller pick the element (h1/h2/span).
 */
export default function BrandMark({
  as: Tag = "span",
  className = "",
  size = "md",
}: {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "text-[0.8rem] tracking-[0.3em]",
    md: "text-sm tracking-[0.34em]",
    lg: "text-xl tracking-[0.32em] sm:text-2xl",
    xl: "text-[2.1rem] tracking-[0.24em] sm:text-5xl sm:tracking-[0.18em] lg:text-7xl",
  } as const;

  return (
    <Tag
      className={`font-display font-bold uppercase leading-none text-ink ${sizes[size]} ${className}`}
    >
      {brand.mark}
    </Tag>
  );
}
