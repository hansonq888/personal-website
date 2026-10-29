import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* The opening frame, as a flash: the hello set goes off like a camera, its
   light blooming out of the glass to white out the whole window, holding for
   a moment, then drawing back into the screen as the room comes up. The
   screen is left lit, ready to shut off and show the picture. */

const BLOOM = 110;   // ms to white out the window
const HOLD = 140;    // ms at full white
const RETREAT = 1050; // ms for the light to draw back into the glass
const FADE = 260;    // ms for the last glow on the glass to go

const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeIn = (t) => t * t * t;

export default function FlashIntro({ glassSelector, onDone }) {
  const [done, setDone] = useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );
  const veil = useRef(null);

  useEffect(() => {
    if (done) onDone?.();
  }, [done, onDone]);

  // a layout effect, so the glow is on the glass from the very first paint
  useLayoutEffect(() => {
    if (done) return;
    const el = veil.current;
    const w = window.innerWidth, h = window.innerHeight;

    const paint = (ms) => {
      const g = document.querySelector(glassSelector)?.getBoundingClientRect();
      const cx = g ? g.left + g.width / 2 : w / 2;
      const cy = g ? g.top + g.height / 2 : h / 2;
      const glass = g ? Math.hypot(g.width, g.height) / 2 : 200;
      const room = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 1.4;

      let r, core = 1, alpha = 1;
      if (ms < BLOOM) {
        r = glass + (room - glass) * easeOut(ms / BLOOM);
      } else if (ms < BLOOM + HOLD) {
        r = room;
      } else if (ms < BLOOM + HOLD + RETREAT) {
        const t = (ms - BLOOM - HOLD) / RETREAT;
        r = room + (glass - room) * easeOut(t);
        core = 1 - 0.25 * easeIn(t);
      } else {
        const t = Math.min(1, (ms - BLOOM - HOLD - RETREAT) / FADE);
        r = glass;
        alpha = 1 - t;
      }
      // white at the source, falling off softly to nothing at r
      el.style.opacity = alpha.toFixed(3);
      el.style.background =
        `radial-gradient(circle at ${cx.toFixed(1)}px ${cy.toFixed(1)}px,` +
        ` rgba(255, 255, 252, ${core.toFixed(3)}) 0px,` +
        ` rgba(255, 255, 252, ${(core * 0.92).toFixed(3)}) ${(r * 0.55).toFixed(1)}px,` +
        ` rgba(235, 242, 255, 0) ${r.toFixed(1)}px)`;
    };
    // the first frame is the glass alone, already lit, before it goes off
    paint(0);

    let start = null, raf = 0;
    const total = BLOOM + HOLD + RETREAT + FADE;
    const loop = (ts) => {
      if (start === null) start = ts;
      const ms = ts - start;
      if (ms >= total) {
        setDone(true);
        return;
      }
      paint(ms);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [done, glassSelector]);

  if (done) return null;
  return (
    <div
      ref={veil}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 80, pointerEvents: "none" }}
    />
  );
}
