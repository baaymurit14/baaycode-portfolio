"use client";

/**
 * Wrapper around the Three.js (R3F) IoT network.
 *
 * Responsibilities:
 *  - lazy-load the heavy 3D bundle only when the hero is near the viewport;
 *  - detect WebGL support before mounting; if unavailable, fall back to the
 *    lightweight 2D canvas network (DataNetwork) so the hero never looks empty;
 *  - never block first paint — nothing heavy runs on the critical path.
 */

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const IoTCanvas = dynamic(() => import("./IoTCanvas"), {
  ssr: false,
  loading: () => null,
});

function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export default function DataNetwork3D() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    setWebgl(supportsWebGL());

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show3D = visible && webgl;

  return (
    <div ref={hostRef} className="absolute inset-0 z-0">
      {show3D && <IoTCanvas />}
      {visible && !webgl && (
        <LightweightFallback />
      )}
    </div>
  );
}

function LightweightFallback() {
  const [Fallback, setFallback] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    let mounted = true;
    import("./DataNetwork").then((m) => {
      if (mounted) setFallback(() => m.default);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return Fallback ? <Fallback /> : null;
}
