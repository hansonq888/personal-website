import { useEffect, useRef, useState } from "react";

/* The opening frame: the page starts covered in paper, and the paper is drawn
   back into the hello set's screen in held, stop-motion frames. Three sheets
   in slightly different whites, each a frame behind the one above, with torn
   edges that re-tear every frame, shrink onto the middle of the glass until
   they are a dot, and the last frame is gone. */

const FPS = 12;
const FRAMES = 19;          // about a second and a half
const POINTS = 22;          // corners on each torn edge
const SHEETS = [
  // bottom to top: the largest, darkest sheet trails furthest behind
  { fill: "#d9d7cf", lag: 2, grow: 1.1 },
  { fill: "#ebe9e2", lag: 1, grow: 1.05 },
  { fill: "#fafaf7", lag: 0, grow: 1 },
];

// how much of the full radius is left at frame k: quick at first, slow to land
const left = (k) => {
  const t = Math.max(0, Math.min(1, k / (FRAMES - 1)));
  return Math.pow(1 - t, 1.6);
};

function tornEdge(cx, cy, r) {
  if (r <= 0.5) return "";
  const pts = [];
  for (let i = 0; i < POINTS; i++) {
    const a = (i / POINTS) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;
    const rr = r * (0.86 + Math.random() * 0.24);
    pts.push((cx + Math.cos(a) * rr).toFixed(1) + "," + (cy + Math.sin(a) * rr).toFixed(1));
  }
  return pts.join(" ");
}

export default function PaperIntro({ targetSelector, onDone }) {
  const [done, setDone] = useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );
  const polys = useRef([]);

  // tell the page once the paper is gone (straight away under reduced motion)
  useEffect(() => {
    if (done) onDone?.();
  }, [done, onDone]);

  useEffect(() => {
    if (done) return;
    const w = window.innerWidth, h = window.innerHeight;
    const el = document.querySelector(targetSelector);
    const r = el?.getBoundingClientRect();
    const cx = r ? r.left + r.width / 2 : w / 2;
    const cy = r ? r.top + r.height / 2 : h / 2;
    // enough to cover the farthest corner of the window, torn edge and all
    const full = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 1.3;

    const draw = (k) => {
      SHEETS.forEach((sheet, i) => {
        const p = polys.current[i];
        if (p) p.setAttribute("points", tornEdge(cx, cy, full * sheet.grow * left(k - sheet.lag)));
      });
    };
    draw(0);

    // Frames are counted from the first painted frame, not from mount, so a
    // tab opened in the background holds the paper until someone looks at it.
    let start = null, shown = 0, raf = 0;
    const loop = (ts) => {
      if (start === null) start = ts;
      const k = Math.floor((ts - start) / (1000 / FPS));
      if (k > FRAMES + 2) {
        setDone(true);
        return;
      }
      if (k !== shown) {
        shown = k;
        draw(k);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [done, targetSelector]);

  if (done) return null;
  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="100%"
      style={{ position: "fixed", inset: 0, zIndex: 80, pointerEvents: "none" }}
    >
      {SHEETS.map((sheet, i) => (
        <polygon
          key={i}
          ref={(n) => (polys.current[i] = n)}
          fill={sheet.fill}
          style={{ filter: "drop-shadow(0 2px 3px rgba(0, 0, 0, 0.28))" }}
        />
      ))}
    </svg>
  );
}
