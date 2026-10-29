import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* The opening frame, as a flash: the hello set goes off like a camera. It is
   cut from flat layers, not blurred light: a starburst of hard rays in three
   whites, each a frame behind the one above, with a long torn streak across
   the window, all moving in held stop-motion frames. The page opens already
   covered by it, and it steps back down into the screen. */

const FPS = 12;
const RAYS = 16;
// the burst's size each frame, as a share of the distance to the farthest
// corner of the window: it opens fully covering the page (it is the loading
// screen), holds a few beats, steps back down into the glass and sits there
// lit; then the set catches power and flashes once more, out and gone
const SIZE = [
  1.7, 1.7, 1.7, 1.7, 1.45, 1.1, 0.82, 0.6, 0.43, 0.3, 0.2, 0.13, 0.08,
  0.05, 0.05, 0.05,
  0.55, 1.25, 0.6, 0.12,
];
const LAYERS = [
  // bottom to top: the widest and coolest trails furthest behind
  { fill: "#dde5ef", lag: 2, grow: 1.12 },
  { fill: "#f3f1ec", lag: 1, grow: 1.05 },
  { fill: "#ffffff", lag: 0, grow: 1 },
];
const STREAK = -0.33; // radians: the flare across the window, low left to high right

const sizeAt = (k) => SIZE[Math.max(0, Math.min(SIZE.length - 1, k))];

// a starburst: ray tips at random lengths, valleys between them
function burst(cx, cy, r) {
  if (r <= 0.5) return "";
  const pts = [];
  const spin = Math.random() * Math.PI * 2;
  for (let i = 0; i < RAYS * 2; i++) {
    const a = spin + (i / (RAYS * 2)) * Math.PI * 2 + (Math.random() - 0.5) * 0.08;
    const rr = i % 2 === 0 ? r * (0.7 + Math.random() * 0.6) : r * (0.42 + Math.random() * 0.1);
    pts.push((cx + Math.cos(a) * rr).toFixed(1) + "," + (cy + Math.sin(a) * rr).toFixed(1));
  }
  return pts.join(" ");
}

// the streak: a long thin blade through the source, torn along both edges
function streak(cx, cy, len, thick) {
  if (len <= 1) return "";
  const dx = Math.cos(STREAK), dy = Math.sin(STREAK);
  const nx = -dy, ny = dx;
  const top = [], bottom = [];
  const N = 14;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 2 - 1;          // -1 .. 1 along the blade
    const taper = 1 - Math.abs(t);      // fat in the middle, sharp at the ends
    const along = t * len;
    const w = thick * (0.25 + taper) * (0.7 + Math.random() * 0.6);
    top.push([cx + dx * along + nx * w, cy + dy * along + ny * w]);
    bottom.push([cx + dx * along - nx * w, cy + dy * along - ny * w]);
  }
  return [...top, ...bottom.reverse()].map(([x, y]) => x.toFixed(1) + "," + y.toFixed(1)).join(" ");
}

export default function FlashIntro({ glassSelector, onDone }) {
  const [done, setDone] = useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );
  const shapes = useRef([]);
  const blade = useRef(null);

  useEffect(() => {
    if (done) onDone?.();
  }, [done, onDone]);

  // a layout effect, so the first frame is on the glass before the first paint
  useLayoutEffect(() => {
    if (done) return;
    const w = window.innerWidth, h = window.innerHeight;

    const draw = (k) => {
      const g = document.querySelector(glassSelector)?.getBoundingClientRect();
      const cx = g ? g.left + g.width / 2 : w / 2;
      const cy = g ? g.top + g.height / 2 : h / 2;
      const room = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy));
      LAYERS.forEach((layer, i) => {
        const p = shapes.current[i];
        if (p) p.setAttribute("points", burst(cx, cy, room * layer.grow * sizeAt(k - layer.lag)));
      });
      const s = sizeAt(k);
      blade.current?.setAttribute("points", streak(cx, cy, room * 1.6 * Math.min(1, s * 1.4), Math.max(6, room * 0.035 * s)));
    };
    draw(0);

    // counted from the first painted frame, so a background tab holds the
    // opening until someone looks at it
    let start = null, shown = 0, raf = 0;
    const loop = (ts) => {
      if (start === null) start = ts;
      const k = Math.floor((ts - start) / (1000 / FPS));
      // two extra frames, so the trailing layers finish their own last steps
      if (k >= SIZE.length + 2) {
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
  }, [done, glassSelector]);

  if (done) return null;
  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="100%"
      style={{ position: "fixed", inset: 0, zIndex: 80, pointerEvents: "none" }}
    >
      {LAYERS.map((layer, i) => (
        <polygon
          key={i}
          ref={(n) => (shapes.current[i] = n)}
          fill={layer.fill}
          style={{ filter: "drop-shadow(0 2px 3px rgba(0, 0, 0, 0.22))" }}
        />
      ))}
      <polygon
        ref={blade}
        fill="#ffffff"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.18))" }}
      />
    </svg>
  );
}
