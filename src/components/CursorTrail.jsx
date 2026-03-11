import { useState, useEffect, useRef } from "react";

const TRAIL_LENGTH = 28;
const THROTTLE_MS = 24;
const FADE_MS = 480;

const TRAIL_COLOR = "#fef08a"; // yellow (site highlight)

export default function CursorTrail() {
  const [trail, setTrail] = useState([]);
  const [visible, setVisible] = useState(false);
  const lastMove = useRef(0);
  const raf = useRef(null);

  useEffect(() => {
    const isTouch = () => window.matchMedia("(pointer: coarse)").matches;
    if (isTouch()) return;

    const addPoint = (x, y) => {
      const now = Date.now();
      setTrail((prev) => {
        const next = [...prev, { x, y, t: now, id: now + Math.random() }].slice(-TRAIL_LENGTH);
        return next;
      });
    };

    const onMove = (e) => {
      const now = Date.now();
      if (now - lastMove.current < THROTTLE_MS) return;
      lastMove.current = now;
      addPoint(e.clientX, e.clientY);
    };

    const tick = () => {
      raf.current = requestAnimationFrame(tick);
      const now = Date.now();
      setTrail((prev) => {
        const cut = prev.filter((p) => now - p.t < FADE_MS);
        return cut.length === prev.length ? prev : cut;
      });
    };

    setVisible(true);
    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      {trail.map((p) => (
        <div
          key={p.id}
          className="cursor-trail-dot absolute rounded-full shadow-sm"
          style={{
            left: p.x,
            top: p.y,
            width: 7,
            height: 7,
            marginLeft: -3.5,
            marginTop: -3.5,
            backgroundColor: TRAIL_COLOR,
            boxShadow: `0 0 8px ${TRAIL_COLOR}60`,
          }}
        />
      ))}
    </div>
  );
}
