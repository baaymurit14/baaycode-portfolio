"use client";

/**
 * Signature hero background — v2.
 *
 * A denser field of circuit traces radiating from a central IC-style module
 * (a stand-in for the Kaaraange board). On mount, traces "power on" one by
 * one like current reaching a board; once lit, a handful keep a slow pulse
 * so the whole thing reads as a live, energised system rather than a static
 * pattern. Pure SVG, no WebGL — stays cheap on low-end phones, which matters
 * given the target audience includes 2G/3G-constrained users.
 */
export default function CircuitField() {
  const traces = [
    "M40,260 H220 V120 H430",
    "M40,340 H160 V420 H520",
    "M430,120 V40 H720",
    "M540,430 H720 V340",
    "M430,120 H640 V260 H860",
    "M160,420 V540 H380",
    "M860,260 V180 H980",
    "M40,180 H140",
    "M980,420 H1080",
    "M380,540 H460 V620",
    "M720,40 H820",
    "M540,430 V520",
  ];

  const nodes = [
    { x: 40, y: 260, r: "minor" },
    { x: 220, y: 120, r: "minor" },
    { x: 430, y: 120, r: "major" },
    { x: 720, y: 40, r: "minor" },
    { x: 40, y: 340, r: "minor" },
    { x: 160, y: 420, r: "minor" },
    { x: 540, y: 430, r: "major" },
    { x: 720, y: 340, r: "minor" },
    { x: 640, y: 260, r: "minor" },
    { x: 860, y: 260, r: "major" },
    { x: 380, y: 540, r: "minor" },
    { x: 980, y: 420, r: "minor" },
    { x: 140, y: 180, r: "minor" },
    { x: 980, y: 180, r: "minor" },
    { x: 460, y: 620, r: "minor" },
    { x: 820, y: 40, r: "minor" },
  ];

  return (
    <svg
      viewBox="0 0 1120 660"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-80 motion-reduce:opacity-35"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="traceFade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3FBFAE" stopOpacity="0" />
          <stop offset="50%" stopColor="#3FBFAE" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#3FBFAE" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="chipGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9793F" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#C9793F" stopOpacity="0" />
        </radialGradient>
        <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* base traces, always visible and static */}
      {traces.map((d, i) => (
        <path key={`base-${i}`} d={d} fill="none" stroke="#1B2127" strokeWidth="1.5" />
      ))}

      {/* power-on draw-in, staggered, once on mount */}
      {traces.map((d, i) => (
        <path
          key={`draw-${i}`}
          d={d}
          fill="none"
          stroke="#2C343C"
          strokeWidth="1.5"
          strokeDasharray="900"
          strokeDashoffset="900"
          className="motion-reduce:hidden"
          style={{
            animation: `drawTrace 1.4s ease-out forwards`,
            animationDelay: `${0.3 + i * 0.12}s`,
          }}
        />
      ))}

      {/* looping signal pulses along a subset of traces */}
      {traces.map((d, i) =>
        i % 2 === 0 ? (
          <path
            key={`pulse-${i}`}
            d={d}
            fill="none"
            stroke="url(#traceFade)"
            strokeWidth="1.5"
            strokeDasharray="140 1400"
            strokeDashoffset="1540"
            className="motion-reduce:hidden"
            style={{
              animation: `traceMove 6s linear infinite`,
              animationDelay: `${2 + i * 0.8}s`,
            }}
          />
        ) : null
      )}

      {/* central module — a stand-in IC / sensor board */}
      <g filter="url(#softGlow)">
        <circle cx="485" cy="275" r="150" fill="url(#chipGlow)" />
        <rect
          x="430"
          y="220"
          width="110"
          height="110"
          rx="6"
          fill="#0D1114"
          stroke="#C9793F"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
        <rect x="452" y="242" width="66" height="66" rx="3" fill="none" stroke="#2C343C" strokeWidth="1" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={`pin-t-${i}`} x={448 + i * 18} y="212" width="8" height="8" fill="#2C343C" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={`pin-b-${i}`} x={448 + i * 18} y="340" width="8" height="8" fill="#2C343C" />
        ))}
      </g>

      {nodes.map((n, i) => (
        <g key={i}>
          <rect
            x={n.x - (n.r === "major" ? 4 : 3)}
            y={n.y - (n.r === "major" ? 4 : 3)}
            width={n.r === "major" ? 8 : 6}
            height={n.r === "major" ? 8 : 6}
            fill={n.r === "major" ? "#E2A162" : "#2C343C"}
            className={n.r === "major" ? "animate-pulseTrace" : ""}
          />
          {n.r === "major" && (
            <circle
              cx={n.x}
              cy={n.y}
              r="4"
              fill="none"
              stroke="#E2A162"
              strokeWidth="1"
              className="origin-center motion-reduce:hidden"
              style={{ animation: "ringExpand 2.8s ease-out infinite", animationDelay: `${i * 0.5}s` }}
            />
          )}
        </g>
      ))}

      <style>{`
        @keyframes traceMove {
          from { stroke-dashoffset: 1540; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes drawTrace {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}
