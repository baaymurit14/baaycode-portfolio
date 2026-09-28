import { brand } from "@/lib/data";

/**
 * PDS monogram. The bridge between the brand (BAAYCODE) and the person.
 * Square, hairline-framed, copper by default.
 */
export default function Monogram({
  className = "",
  size = "md",
  accent = "copper",
}: {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  accent?: "copper" | "signal" | "ink";
}) {
  const sizes = {
    xs: "h-7 w-7 text-[9px]",
    sm: "h-9 w-9 text-[11px]",
    md: "h-11 w-11 text-[13px]",
    lg: "h-16 w-16 text-lg",
  } as const;

  const accents = {
    copper: "border-copper/55 text-copper group-hover:bg-copper group-hover:text-base",
    signal: "border-signal/55 text-signal group-hover:bg-signal group-hover:text-base",
    ink: "border-line-strong text-ink group-hover:border-ink",
  } as const;

  return (
    <span
      aria-hidden="true"
      className={`monogram shrink-0 tracking-[0.06em] transition-colors duration-300 ${sizes[size]} ${accents[accent]} ${className}`}
    >
      {brand.monogram}
    </span>
  );
}
