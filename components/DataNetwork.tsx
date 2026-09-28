"use client";

/**
 * Lightweight "data network" hero background.
 *
 * A 3D-projected network of nodes, connections and drifting particles that
 * abtracts the Full-Stack & IoT identity (sensors → cloud → interface).
 *
 * Implemented as a plain 2D Canvas with a simple perspective projection so it
 * needs no WebGL and no external runtime. It is intentionally subtle: it sits
 * behind the content and never competes with the name or the photo.
 *
 * Performance / robustness:
 *  - lazy-mounted and paused when off-screen, so it never blocks first paint;
 *  - particle count scaled down on mobile;
 *  - honours prefers-reduced-motion (static frame);
 *  - degrades gracefully if Canvas 2D is unavailable.
 */

import { useEffect, useRef, useState } from "react";

export default function DataNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Lazy-mount only when the hero is near the viewport, so initial load is not blocked.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setEnabled(true);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const io = new IntersectionObserver(
      (entries) => setEnabled(entries[0].isIntersecting),
      { rootMargin: "120px" }
    );
    io.observe(canvas);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = ctx;

    const isMobile = window.innerWidth < 768;
    const NODE_COUNT = isMobile ? 26 : 44;
    const LINK_COUNT = isMobile ? 20 : 34;
    const MAX_LINK_DIST = 120;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let mouseX = 0;
    let mouseY = 0;

    type Node = {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      r: number;
      signal: number;
      t: number;
    };

    let nodes: Node[] = [];

    function rand(min: number, max: number) {
      return min + Math.random() * (max - min);
    }

    function makeNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: rand(-1, 1),
          y: rand(-1, 1),
          z: rand(-1, 1),
          vx: rand(-0.0006, 0.0006),
          vy: rand(-0.0006, 0.0006),
          vz: rand(-0.0006, 0.0006),
          r: rand(1, 2.6),
          signal: Math.random() < 0.35 ? 1 : 0,
          t: Math.random() * Math.PI * 2,
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const el = canvas!;
      width = el.clientWidth;
      height = el.clientHeight;
      el.width = Math.floor(width * dpr);
      el.height = Math.floor(height * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeNodes();
    }

    function project(n: Node) {
      // perspective: scale by depth
      const scale = 340 / (340 - n.z * 260);
      const sx = width / 2 + n.x * width * 0.42 * scale;
      const sy = height / 2 + n.y * height * 0.42 * scale;
      return { sx, sy, scale };
    }

    function step(time: number) {
      c.clearRect(0, 0, width, height);

      // slight mouse parallax
      const mx = (mouseX / width - 0.5) * 14;
      const my = (mouseY / height - 0.5) * 14;

      const pts = nodes.map((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;
        // wrap around
        if (n.x > 1.1) n.x = -1.1;
        if (n.x < -1.1) n.x = 1.1;
        if (n.y > 1.1) n.y = -1.1;
        if (n.y < -1.1) n.y = 1.1;
        if (n.z > 1.1) n.z = -1.1;
        if (n.z < -1.1) n.z = 1.1;
        const p = project(n);
        return { ...p, n };
      });

      // links
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].sx - pts[j].sx;
          const dy = pts[i].sy - pts[j].sy;
          const dist = Math.hypot(dx, dy);
          if (dist < MAX_LINK_DIST) {
            const alpha = (1 - dist / MAX_LINK_DIST) * 0.28 * pts[i].scale;
            c.strokeStyle = `rgba(63,191,174,${alpha})`;
            c.lineWidth = 0.6;
            c.beginPath();
            c.moveTo(pts[i].sx, pts[i].sy);
            c.lineTo(pts[j].sx, pts[j].sy);
            c.stroke();
          }
        }
      }

      // nodes
      for (const p of pts) {
        const isMajor = p.n.r > 1.9;
        c.beginPath();
        c.arc(p.sx + mx, p.sy + my, p.n.r * p.scale, 0, Math.PI * 2);
        c.fillStyle = isMajor
          ? "rgba(201,121,63,0.7)"
          : "rgba(233,235,236,0.5)";
        c.fill();
      }

      // animated data pulses along a few chosen nodes
      for (let i = 0; i < pts.length; i++) {
        if (!pts[i].n.signal) continue;
        const x = pts[i].sx + mx;
        const y = pts[i].sy + my;
        const pulse = (time * 0.0009) % 1 + i * 0.13;
        const px = x + Math.cos(pts[i].n.t + pulse * Math.PI * 2) * 8;
        const py = y + Math.sin(pts[i].n.t + pulse * Math.PI * 2) * 8;
        c.beginPath();
        c.arc(px, py, 1.6, 0, Math.PI * 2);
        c.fillStyle = `rgba(99,217,200,${0.5 + 0.5 * Math.sin(pulse * Math.PI)})`;
        c.fill();
      }

      if (!reduceMotion) {
        raf = requestAnimationFrame(step);
      }
    }

    function onPointerMove(e: PointerEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      // render one static frame
      step(0);
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [enabled, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70 motion-reduce:opacity-30"
    />
  );
}
