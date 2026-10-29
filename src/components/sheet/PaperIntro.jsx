import { useEffect, useRef, useState } from "react";

/* The opening frame: the page starts covered in paper, and the paper is drawn
   into the hello set's screen in held, stop-motion frames until it lies
   exactly on the glass. Three sheets in slightly different whites, each a
   frame behind the one above, start as torn circles past the edge of the
   window and settle onto the glass's tilted outline, their tears smoothing as
   they land. The screen beneath is already showing the same paper, so the
   last frame hands over to it without a seam. */

const FPS = 12;
const FRAMES = 19;          // about a second and a half
const POINTS = 40;          // corners on each torn edge
const SHEETS = [
  // bottom to top: the largest, darkest sheet trails furthest behind
  { fill: "#d9d7cf", lag: 2, grow: 1.1 },
  { fill: "#ebe9e2", lag: 1, grow: 1.05 },
  { fill: "#f3f1ec", lag: 0, grow: 1 },
];

// how far frame k has carried a sheet onto the glass: quick at first, slow to land
const landed = (k) => {
  const t = Math.max(0, Math.min(1, k / (FRAMES - 1)));
  return 1 - Math.pow(1 - t, 1.6);
};

// the glass's four projected corners, read from markers inside it, with each
// corner cut back a little so the outline follows its rounded glass
function glassOutline(selector) {
  const marks = ["tl", "tr", "br", "bl"].map((c) =>
    document.querySelector(`${selector} .glass-corner.${c}`)?.getBoundingClientRect()
  );
  if (marks.some((m) => !m)) return null;
  const q = marks.map((m) => [m.left, m.top]);
  const cut = 0.07;
  const poly = [];
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = q[(i + 3) % 4], [bx, by] = q[i], [cx, cy] = q[(i + 1) % 4];
    poly.push([bx + (ax - bx) * cut, by + (ay - by) * cut]);
    poly.push([bx + (cx - bx) * cut, by + (cy - by) * cut]);
  }
  const mx = q.reduce((s, p) => s + p[0], 0) / 4;
  const my = q.reduce((s, p) => s + p[1], 0) / 4;
  return { poly, mx, my };
}

// where a ray from (mx, my) at angle a leaves the outline
function rayHit(mx, my, a, poly) {
  const dx = Math.cos(a), dy = Math.sin(a);
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % poly.length];
    const ex = x2 - x1, ey = y2 - y1;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((x1 - mx) * ey - (y1 - my) * ex) / den;
    const u = ((x1 - mx) * dy - (y1 - my) * dx) / den;
    if (t > 0 && u >= 0 && u <= 1 && t < best) best = t;
  }
  return best === Infinity ? 0 : best;
}

export default function PaperIntro({ glassSelector, onDone }) {
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

    const draw = (k) => {
      // read the glass every frame: the set floats, so its outline moves
      const g = glassOutline(glassSelector) || { poly: null, mx: w / 2, my: h / 2 };
      const { mx, my } = g;
      const full = Math.hypot(Math.max(mx, w - mx), Math.max(my, h - my)) * 1.3;
      SHEETS.forEach((sheet, i) => {
        const p = polys.current[i];
        if (!p) return;
        const e = landed(k - sheet.lag);
        const tear = 1 - e; // tears smooth out as the sheet seats
        const pts = [];
        for (let j = 0; j < POINTS; j++) {
          const a = (j / POINTS) * Math.PI * 2;
          const end = g.poly ? rayHit(mx, my, a, g.poly) : 0;
          const start = full * sheet.grow;
          const r = (start + (end - start) * e) * (1 + (Math.random() - 0.5) * 0.22 * tear);
          const aj = a + (Math.random() - 0.5) * 0.12 * tear;
          pts.push((mx + Math.cos(aj) * r).toFixed(1) + "," + (my + Math.sin(aj) * r).toFixed(1));
        }
        p.setAttribute("points", pts.join(" "));
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
  }, [done, glassSelector]);

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
