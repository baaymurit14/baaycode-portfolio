import type { Config } from "tailwindcss";

/**
 * BAAYCODE design system.
 *
 * Colour discipline (deliberate, not decorative):
 *   copper  #C9793F → the human layer: person, story, achievement, recognition.
 *   signal  #3FBFAE → the technical layer: IoT, data, cloud, code.
 * The two never appear in the same accent slot, so the palette carries meaning
 * instead of noise.
 */

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0A0D10",
          raised: "#12161B",
          panel: "#161B21",
          deep: "#070A0C",
        },
        line: {
          DEFAULT: "#20262D",
          strong: "#2C343C",
        },
        ink: {
          DEFAULT: "#E9EBEC",
          muted: "#9AA3AB",
          faint: "#5C666F",
        },
        copper: {
          DEFAULT: "#C9793F",
          bright: "#E2A162",
          dim: "#8A5730",
        },
        signal: {
          DEFAULT: "#3FBFAE",
          bright: "#63D9C8",
          dim: "#2A8578",
        },
      },

      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },

      /* --- Editorial type scale -------------------------------------------
       * The display scale is deliberately huge. Section headings are treated
       * as graphic elements, not as labels. clamp() keeps them fluid from
       * 375px to 1920px without a single media query. */
      fontSize: {
        "display-xl": ["clamp(2.75rem, 14vw, 13rem)", { lineHeight: "0.84", letterSpacing: "-0.045em" }],
        "display-lg": ["clamp(2.4rem, 10vw, 8.5rem)", { lineHeight: "0.88", letterSpacing: "-0.04em" }],
        "display-md": ["clamp(1.9rem, 6vw, 4.75rem)", { lineHeight: "0.94", letterSpacing: "-0.032em" }],
        "display-sm": ["clamp(1.5rem, 4vw, 2.6rem)", { lineHeight: "1.02", letterSpacing: "-0.022em" }],
        "lede": ["clamp(1rem, 1.8vw, 1.4rem)", { lineHeight: "1.5", letterSpacing: "-0.012em" }],
        "micro": ["0.6875rem", { lineHeight: "1.1", letterSpacing: "0.22em" }],
      },

      letterSpacing: {
        brand: "0.34em",
        wide2: "0.18em",
      },

      maxWidth: {
        editorial: "1340px",
        prose: "62ch",
      },

      backgroundImage: {
        grid: "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
        /* Fine film grain. Two offset dot fields so the pattern doesn't read
           as a repeating tile. Fixed-size so it tiles seamlessly. */
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E\")",
        /* Soft radial washes used to keep large dark fields from going flat. */
        "copper-wash":
          "radial-gradient(120% 90% at 100% 0%, rgba(201,121,63,0.13) 0%, transparent 58%)",
        "signal-wash":
          "radial-gradient(110% 85% at 0% 0%, rgba(63,191,174,0.12) 0%, transparent 60%)",
        "vignette":
          "radial-gradient(130% 100% at 50% 40%, transparent 40%, rgba(7,10,12,0.72) 100%)",
      },

      backgroundSize: {
        grid: "44px 44px",
        grain: "180px 180px",
      },

      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },

      /* 400ms is the workhorse duration for hover and colour transitions on
         this site; Tailwind's default scale jumps 300 → 500. */
      transitionDuration: {
        400: "400ms",
      },

      keyframes: {
        /* --- pre-existing, still used by IoTCanvas / CircuitField --------- */
        pulseTrace: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "1" },
        },
        dash: { to: { strokeDashoffset: "0" } },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
        chipFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scan: {
          from: { transform: "translateX(-120%) skewX(-12deg)" },
          to: { transform: "translateX(220%) skewX(-12deg)" },
        },
        ringExpand: {
          "0%": { transform: "scale(0.6)", opacity: "0.6" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },

        /* --- BAAYCODE additions ------------------------------------------- */
        /* Infinite ticker used for the brand marquee. */
        marquee: {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(-50%,0,0)" },
        },
        /* Hairline rules that draw themselves in on scroll reveal. */
        drawX: { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
        drawY: { from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" } },
        /* Grain drift — 8px step so the texture never visibly loops. */
        grainShift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "20%": { transform: "translate3d(-3%, 2%, 0)" },
          "40%": { transform: "translate3d(2%, -3%, 0)" },
          "60%": { transform: "translate3d(-2%, -2%, 0)" },
          "80%": { transform: "translate3d(3%, 1%, 0)" },
        },
        /* Slow breathing glow for the live "system online" indicator. */
        breathe: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.6)" },
        },
        /* A single pass of a sweep across a document/photo frame. */
        sheen: {
          from: { transform: "translateX(-130%) skewX(-18deg)" },
          to: { transform: "translateX(260%) skewX(-18deg)" },
        },
        /* Cursor-reactive nodes for the build section glyphs. */
        nodePulse: {
          "0%, 100%": { r: "2", opacity: "0.9" },
          "50%": { r: "4.5", opacity: "0.4" },
        },
      },

      animation: {
        pulseTrace: "pulseTrace 3.2s ease-in-out infinite",
        dash: "dash 2.4s ease-out forwards",
        fadeUp: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        blink: "blink 1.8s ease-in-out infinite",
        chipFloat: "chipFloat 6s ease-in-out infinite",
        scan: "scan 1.1s ease-in-out",
        ringExpand: "ringExpand 2.6s ease-out infinite",
        marquee: "marquee 38s linear infinite",
        grain: "grainShift 6s steps(1) infinite",
        breathe: "breathe 2.8s ease-in-out infinite",
        sheen: "sheen 1.4s ease-out",
        nodePulse: "nodePulse 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
