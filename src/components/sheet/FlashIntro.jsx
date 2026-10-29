import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* The opening frame, as a flash: the hello set goes off like a camera. It is
   cut from flat layers, not blurred light: a starburst of hard rays in three
   whites, each a frame behind the one above, all moving in held
   stop-motion frames. The page opens already
   covered by it, and it steps back down into the screen. */

const FPS = 12;
const RAYS = 16;
// the burst's size each frame, as a share of the distance to the farthest
// corner of the window: it opens fully covering the page (it is the loading
// screen), holds a few beats, steps back down into the glass and sits there
// lit; then the set catches power and flashes once more, this time only
// inside the glass, and is gone
const SIZE = [
  1.7, 1.7, 1.7, 1.7, 1.45, 1.1, 0.82, 0.6, 0.43, 0.3, 0.2, 0.13, 0.08,
  0.05, 0.05, 0.05,
  0.22, 0.5, 0.3, 0.1,
];
const REFLASH = 16; // the frame the second flash starts, from which it is held to the glass
const LAYERS = [
  // bottom to top: the widest and coolest trails furthest behind
  { fill: "#dde5ef", lag: 2, grow: 1.12 },
  { fill: "#f3f1ec", lag: 1, grow: 1.05 },
  { fill: "#ffffff", lag: 0, grow: 1 },
];

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

// The glass's real outline on screen: its rounded rectangle (the curved
// corners included) traced in its own flat coordinates, then carried onto the
// tilted set by stretching it between the four projected corner markers. A
// hair inside the edge, so nothing lights the bezel.
function glassOutline(selector) {
  const glass = document.querySelector(selector);
  const marks = ["tl", "tr", "br", "bl"].map((c) =>
    document.querySelector(`${selector} .glass-corner.${c}`)?.getBoundingClientRect()
  );
  if (!glass || marks.some((m) => !m)) return null;
  const [tl, tr, br, bl] = marks.map((m) => [m.left, m.top]);
  const W = glass.offsetWidth, H = glass.offsetHeight;
  const [rx = 0, ry = rx] = getComputedStyle(glass).borderTopLeftRadius.split(" ").map(parseFloat);
  const inset = 2;
  const ax = Math.max(0, rx - inset), ay = Math.max(0, ry - inset);

  // the flat outline, clockwise from the top-left curve
  const local = [];
  const arc = (cx, cy, from) => {
    for (let i = 0; i <= 10; i++) {
      const t = from + (i / 10) * (Math.PI / 2);
      local.push([cx + Math.cos(t) * ax, cy + Math.sin(t) * ay]);
    }
  };
  arc(inset + ax, inset + ay, Math.PI);               // top-left
  arc(W - inset - ax, inset + ay, Math.PI * 1.5);     // top-right
  arc(W - inset - ax, H - inset - ay, 0);             // bottom-right
  arc(inset + ax, H - inset - ay, Math.PI * 0.5);     // bottom-left

  // stretch each flat point between the projected corners
  return local
    .map(([x, y]) => {
      const u = x / W, v = y / H;
      const px = (1 - u) * (1 - v) * tl[0] + u * (1 - v) * tr[0] + u * v * br[0] + (1 - u) * v * bl[0];
      const py = (1 - u) * (1 - v) * tl[1] + u * (1 - v) * tr[1] + u * v * br[1] + (1 - u) * v * bl[1];
      return px.toFixed(1) + "," + py.toFixed(1);
    })
    .join(" ");
}

export default function FlashIntro({ glassSelector, onDone }) {
  const [done, setDone] = useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );
  const shapes = useRef([]);
  const group = useRef(null);
  const glassClip = useRef(null);

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
      // the second flash happens on the screen, not in the room: from its
      // first frame everything is clipped to the glass's own outline
      const outline = glassOutline(glassSelector);
      if (outline) glassClip.current?.setAttribute("points", outline);
      if (k >= REFLASH) group.current?.setAttribute("clip-path", "url(#flash-glass)");
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
      <defs>
        <clipPath id="flash-glass">
          <polygon ref={glassClip} />
        </clipPath>
      </defs>
      <g ref={group}>
        {LAYERS.map((layer, i) => (
          <polygon
            key={i}
            ref={(n) => (shapes.current[i] = n)}
            fill={layer.fill}
            style={{ filter: "drop-shadow(0 2px 3px rgba(0, 0, 0, 0.22))" }}
          />
        ))}
      </g>
    </svg>
  );
}
