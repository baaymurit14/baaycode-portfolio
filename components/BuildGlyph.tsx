"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { BuildCategory } from "@/lib/data";

/**
 * Inline animated glyphs for the "What I Build" categories.
 *
 * Each is a small SVG diagram that loops subtly — nodes for IoT, stacked
 * layers for Cloud, a browser frame for Web, and so on. Pure SVG, so they cost
 * almost nothing and animate via CSS rather than JS.
 */

function GlyphBase({ children, accent }: { children: React.ReactNode; accent: "copper" | "signal" }) {
  const stroke = accent === "copper" ? "#C9793F" : "#3FBFAE";
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="h-full w-full"
      role="presentation"
    >
      <rect
        x="0.75"
        y="0.75"
        width="62.5"
        height="62.5"
        stroke={stroke}
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
      {children}
    </svg>
  );
}

function web() {
  return (
    <GlyphBase accent="signal">
      <rect x="12" y="16" width="40" height="30" stroke="#3FBFAE" strokeWidth="1.5" />
      <path d="M12 24h40" stroke="#3FBFAE" strokeWidth="1.5" />
      <circle cx="17" cy="20" r="1.4" fill="#3FBFAE" />
      <circle cx="22" cy="20" r="1.4" fill="#3FBFAE" />
      <g className="motion-safe:animate-blink">
        <rect x="18" y="30" width="18" height="2" fill="#3FBFAE" fillOpacity="0.7" />
      </g>
      <g className="motion-safe:animate-blink" style={{ animationDelay: "0.4s" }}>
        <rect x="18" y="36" width="26" height="2" fill="#3FBFAE" fillOpacity="0.45" />
      </g>
      <rect x="18" y="42" width="10" height="2" fill="#3FBFAE" fillOpacity="0.3" />
    </GlyphBase>
  );
}

function iot() {
  return (
    <GlyphBase accent="signal">
      {/* hub + satellite nodes, the IoT star topology */}
      <circle cx="32" cy="32" r="5" stroke="#3FBFAE" strokeWidth="1.6" />
      <circle cx="32" cy="32" r="2" fill="#3FBFAE" />
      <path
        d="M32 27V16M37 32h11M32 37v11M27 32H16"
        stroke="#3FBFAE"
        strokeWidth="1.2"
        strokeOpacity="0.55"
      />
      <circle cx="32" cy="14" r="3" stroke="#3FBFAE" strokeWidth="1.4" />
      <circle cx="50" cy="32" r="3" stroke="#3FBFAE" strokeWidth="1.4" />
      <circle cx="32" cy="50" r="3" stroke="#3FBFAE" strokeWidth="1.4" />
      <circle cx="14" cy="32" r="3" stroke="#3FBFAE" strokeWidth="1.4" />
      {/* pulsing rings on two of the satellites */}
      <circle
        cx="32"
        cy="14"
        r="3"
        stroke="#3FBFAE"
        strokeWidth="1"
        className="origin-center motion-safe:animate-ringExpand"
      />
      <circle
        cx="50"
        cy="32"
        r="3"
        stroke="#3FBFAE"
        strokeWidth="1"
        className="origin-center motion-safe:animate-ringExpand"
        style={{ animationDelay: "1.1s" }}
      />
    </GlyphBase>
  );
}

function cloud() {
  return (
    <GlyphBase accent="signal">
      <path
        d="M22 40h20a7 7 0 0 0 1-13.9A11 11 0 0 0 22 24a8 8 0 0 0 0 16Z"
        stroke="#3FBFAE"
        strokeWidth="1.5"
      />
      <path d="M32 46v6" stroke="#3FBFAE" strokeWidth="1.3" strokeOpacity="0.6" />
      <g className="motion-safe:animate-blink">
        <circle cx="32" cy="29" r="1.8" fill="#3FBFAE" />
      </g>
      <circle cx="24" cy="34" r="1.2" fill="#3FBFAE" fillOpacity="0.6" />
      <circle cx="40" cy="34" r="1.2" fill="#3FBFAE" fillOpacity="0.6" />
    </GlyphBase>
  );
}

function product() {
  return (
    <GlyphBase accent="copper">
      {/* idea → product: a node refining into stacked layers */}
      <circle cx="20" cy="32" r="3" fill="#C9793F" />
      <circle cx="32" cy="24" r="2" fill="#C9793F" fillOpacity="0.7" />
      <circle cx="44" cy="32" r="2" fill="#C9793F" fillOpacity="0.45" />
      <path d="M23 31l7-6M34 25l8 6" stroke="#C9793F" strokeWidth="1.1" strokeOpacity="0.5" />
      <rect x="16" y="42" width="32" height="3" fill="#C9793F" fillOpacity="0.55" />
      <rect x="20" y="47" width="24" height="3" fill="#C9793F" fillOpacity="0.32" />
    </GlyphBase>
  );
}

function prototype() {
  return (
    <GlyphBase accent="copper">
      {/* breadboard outline with components + a probe */}
      <rect x="14" y="26" width="36" height="18" stroke="#C9793F" strokeWidth="1.4" />
      <g stroke="#C9793F" strokeWidth="0.8" strokeOpacity="0.4">
        {[20, 26, 32, 38, 44].map((x) => (
          <line key={x} x1={x} y1="29" x2={x} y2="41" />
        ))}
      </g>
      <rect x="22" y="31" width="9" height="7" fill="#C9793F" fillOpacity="0.6" />
      <circle cx="40" cy="34" r="3" stroke="#C9793F" strokeWidth="1.3" />
      <path d="M40 22V18M36 18h8" stroke="#C9793F" strokeWidth="1.3" strokeOpacity="0.7" />
      <path d="M14 22h36" stroke="#C9793F" strokeWidth="1" strokeDasharray="3 4" strokeOpacity="0.5" />
    </GlyphBase>
  );
}

const GLYPHS = { web, iot, cloud, product, prototype } as const;

export default function BuildGlyph({
  glyph,
  accent,
}: {
  glyph: BuildCategory["glyph"];
  accent: BuildCategory["accent"];
}) {
  const reduce = useReducedMotion();
  const Render = GLYPHS[glyph];

  // Under reduced motion the diagrams are shown as static line art.
  if (reduce) return <Render />;

  return (
    <motion.div
      whileHover={{ rotate: -3, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="h-full w-full"
    >
      <Render />
    </motion.div>
  );
}
