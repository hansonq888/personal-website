import { useEffect, useRef } from "react";

/* A ringed planet, rendered as a bitmap. Each frame is worked out pixel by
   pixel on a small canvas: a lit sphere whose cloud bands and storm drift
   round as it turns, and a tilted ring whose far side passes behind the
   planet and near side in front. Tones are picked from a short grey palette
   through an ordered dither, and the canvas is scaled up without smoothing,
   so it reads as pixel art. It turns in held frames, like the rest of the
   sheet. */

const N = 84;          // canvas size in pixels; shown much larger
const FPS = 12;
const R = N * 0.25;    // planet radius in pixels
const TILT = -0.38;    // ring tilt across the screen, radians
const FLAT = 0.3;      // how edge-on the ring is

// monochrome, from the ground's near-black up to the sheet's own off-white
// ink, so the planet sits in the field rather than on it
const PLANET = ["#0c0c0f", "#24242a", "#45454d", "#73737b", "#a9a9ae", "#e4e4e0"];
const RING = ["#1c1c21", "#3c3c43", "#6c6c73", "#a3a3a8", "#dcdcd8"];

// a 4x4 Bayer matrix: the threshold pattern that turns tone into dots
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const pick = (pal, v, x, y) => {
  const t = Math.max(0, Math.min(0.999, v)) * (pal.length - 1);
  const i = Math.floor(t);
  return pal[Math.min(pal.length - 1, i + (t - i > BAYER[(y % 4) * 4 + (x % 4)] ? 1 : 0))];
};

const L = (() => {
  const v = [-0.55, -0.6, 0.58];
  const m = Math.hypot(...v);
  return v.map((c) => c / m);
})();

function ringAt(nx, ny) {
  // into the ring's own frame: u along it, v across it, stretched back to a circle
  const u = nx * Math.cos(TILT) + ny * Math.sin(TILT);
  const v = -nx * Math.sin(TILT) + ny * Math.cos(TILT);
  const d = Math.hypot(u, v / FLAT);
  if (d < 1.4 || d > 2.25) return null;
  if (d > 1.78 && d < 1.86) return null; // the gap between the rings
  const shade = 0.45 + 0.35 * Math.sin(d * 14) + (d < 1.78 ? 0.15 : 0);
  return { front: v > 0, shade };
}

function render(ctx, img, turn) {
  const px = img.data;
  const c = N / 2;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const nx = (x + 0.5 - c) / R, ny = (y + 0.5 - c) / R;
      const ring = ringAt(nx, ny);
      const r2 = nx * nx + ny * ny;
      let col = null;

      if (r2 < 1) {
        const nz = Math.sqrt(1 - r2);
        const lit = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
        const lat = Math.asin(ny);
        const lon = Math.atan2(nx, nz) + turn;
        // banded clouds that wander in longitude, and one storm going round
        const bands = 0.5 + 0.5 * Math.sin(lat * 9 + 0.8 * Math.sin(lon * 2 + lat * 4));
        const sx = Math.sin(lon - 0.4), sy = lat - 0.35;
        const storm = Math.cos(lon - 0.4) > 0 && sx * sx * 6 + sy * sy * 30 < 0.6 ? 0.25 : 0;
        // the ring's shadow falls across the planet just below its equator
        const shadow = Math.abs(-nx * Math.sin(TILT) + ny * Math.cos(TILT) - 0.18) < 0.05 ? 0.55 : 1;
        const tone = (0.12 + 0.88 * lit) * (0.72 + 0.28 * bands + storm) * shadow;
        col = pick(PLANET, tone, x, y);
        if (ring && ring.front) col = pick(RING, ring.shade * (0.5 + 0.5 * lit + 0.2), x, y);
      } else if (ring) {
        col = pick(RING, ring.shade * (ring.front ? 1 : 0.8), x, y);
      }

      const i = (y * N + x) * 4;
      if (col) {
        px[i] = parseInt(col.slice(1, 3), 16);
        px[i + 1] = parseInt(col.slice(3, 5), 16);
        px[i + 2] = parseInt(col.slice(5, 7), 16);
        px[i + 3] = 255;
      } else {
        px[i + 3] = 0;
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

export default function PixelPlanet({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(N, N);
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    render(ctx, img, 0.6);
    if (still) return;

    let raf = 0, last = 0, turn = 0.6;
    const loop = (ts) => {
      raf = requestAnimationFrame(loop);
      if (ts - last < 1000 / FPS) return;
      last = ts;
      turn += 0.09;
      render(ctx, img, turn);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} width={N} height={N} aria-hidden="true" className={"pixel-planet " + className} />;
}
