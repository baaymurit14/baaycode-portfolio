"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/* ================================================================== *
 * SSR-SAFE MOTION
 *
 * Why this isn't `initial={{opacity:0}} whileInView={{opacity:1}}`:
 * framer-motion serialises the *initial* styles into the server HTML, so every
 * animated element ships as `style="opacity:0"`. If the bundle is slow, blocked
 * or fails outright, the entire page — including the hero and the LCP image —
 * is invisible, and unreadable to anything that doesn't execute JavaScript.
 *
 * Instead everything renders fully visible on the server. The hidden state is
 * applied in `useLayoutEffect`, which runs *before* the browser's first paint,
 * so there is no flash and nothing is hidden without JavaScript. The visible
 * state is then released on the next animation frame (mount) or when the
 * element scrolls into view.
 * ================================================================== */

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

type Direction = "up" | "down" | "left" | "right" | "none";
type Mode = "view" | "mount";
type Accent = "none" | "all" | "last";

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 22 },
  down: { x: 0, y: -22 },
  left: { x: 26, y: 0 },
  right: { x: -26, y: 0 },
  none: { x: 0, y: 0 },
};

type Tag =
  | "div"
  | "section"
  | "li"
  | "article"
  | "span"
  | "header"
  | "figure"
  | "h2"
  | "p"
  | "dl";

/** Reads `prefers-reduced-motion` in an effect, never during render. */
function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    setReduce(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduce;
}

/**
 * Core hook. Returns the inline style to spread, plus whether the element is
 * currently parked in its hidden state.
 */
function useMotion({
  direction = "up",
  mode = "view",
  delay,
  duration,
  scale,
  skip,
  ref,
}: {
  direction?: Direction;
  mode?: Mode;
  delay: number;
  duration: number;
  scale?: number;
  skip: boolean;
  ref: React.RefObject<HTMLElement | null>;
}) {
  const [phase, setPhase] = useState<"idle" | "hidden" | "shown">("idle");

  useLayoutEffect(() => {
    // Reduced motion must never leave anything hidden, including when the
    // preference is only detected after the first render.
    if (skip) {
      setPhase("idle");
      return;
    }

    if (mode === "mount") {
      setPhase("hidden");
      const raf = requestAnimationFrame(() => setPhase("shown"));
      return () => cancelAnimationFrame(raf);
    }

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    // Content already on screen at load is left alone: animating it would hide
    // the LCP content for no benefit.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    setPhase("hidden");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPhase("shown");
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, skip, mode]);

  const { x, y } = offsets[direction];
  const from = `translate3d(${x}px, ${y}px, 0)${
    scale !== undefined ? ` scale(${scale})` : ""
  }`;

  let style: CSSProperties | undefined;
  if (skip) {
    style = undefined;
  } else if (phase === "hidden") {
    style = { opacity: 0, transform: from, transition: "none" };
  } else if (phase === "shown") {
    style = {
      opacity: 1,
      transform: "translate3d(0,0,0)",
      transition: `opacity ${duration}s ${EASE} ${delay}s, transform ${duration}s ${EASE} ${delay}s`,
    };
  }

  return { style, phase };
}

/* ================================================================== *
 * Reveal — fade/rise, triggered when the element scrolls into view.
 * ================================================================== */

export default function Reveal({
  children,
  delay = 0,
  duration = 0.7,
  direction = "up",
  className = "",
  as = "div",
}: {
  children?: ReactNode;
  delay?: number;
  duration?: number;
  direction?: Direction;
  className?: string;
  as?: Tag;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const { style } = useMotion({
    direction,
    delay,
    duration,
    skip: reduce,
    ref,
  });
  const Tag = as as "div";

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}

/* ================================================================== *
 * Enter — same mechanism, triggered on mount. Used above the fold so the
 * hero can still have an entrance without shipping hidden HTML.
 * ================================================================== */

export function Enter({
  children,
  delay = 0,
  duration = 0.8,
  direction = "up",
  scale,
  className = "",
  as = "div",
}: {
  children?: ReactNode;
  delay?: number;
  duration?: number;
  direction?: Direction;
  scale?: number;
  className?: string;
  as?: Tag;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const { style } = useMotion({
    direction,
    mode: "mount",
    delay,
    duration,
    scale,
    skip: reduce,
    ref,
  });
  const Tag = as as "div";

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}

/* ================================================================== *
 * RevealLines — line-by-line masked reveal for display headings.
 *
 * Each line slides up from behind its own mask, so the type reads as if it is
 * being printed onto the page. The visual lines are hidden from assistive
 * tech and mirrored in a single visually-hidden span, so a heading is announced
 * once rather than once per line.
 * ================================================================== */

export function RevealLines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  accent = "none",
  duration = 0.9,
  mode = "view",
  stagger = 0.09,
}: {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Which lines render in the copper accent. */
  accent?: Accent;
  duration?: number;
  mode?: Mode;
  /** Seconds added per line. */
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();
  const { phase } = useMotion({
    direction: "up",
    mode,
    delay: 0,
    duration: 0,
    skip: reduce,
    ref,
  });

  const isAccent = (i: number) =>
    accent === "all" || (accent === "last" && i === lines.length - 1);

  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
    <span
      key={line + i}
      aria-hidden="true"
      className={`line-mask ${lineClassName} ${
        isAccent(i) ? "text-copper" : ""
      }`}
    >
      <span
        style={{
          display: "block",
          transform:
            phase === "hidden" ? "translate3d(0,110%,0)" : "translate3d(0,0,0)",
          transition: reduce
            ? "none"
            : `transform ${duration}s ${EASE} ${delay + i * stagger}s`,
          willChange: "transform",
        }}
      >
        {line}
      </span>
    </span>
      ))}
      <span className="sr-only">{lines.join(" ")}</span>
    </span>
  );
}
