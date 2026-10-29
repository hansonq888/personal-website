import { useEffect, useRef } from "react";

/* The paper, arrived on the glass: once the opening sheets have been drawn
   into the screen it is filled with the same warm off-white, its grain
   shifting at the intro's own stop-motion rate, before it dissolves into the
   picture. Low-resolution and scaled up without smoothing, like a paper fibre
   seen through the tube. */

const W = 160;
const H = 100;
const FPS = 12;

export default function TvStatic({ fading = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const frame = ctx.createImageData(W, H);
    const d = frame.data;
    let raf = 0, last = 0;
    const loop = (ts) => {
      raf = requestAnimationFrame(loop);
      if (ts - last < 1000 / FPS) return;
      last = ts;
      for (let i = 0; i < d.length; i += 4) {
        // paper, not snow: a narrow band of warm whites
        const v = 222 + Math.random() * 30;
        d[i] = v; d[i + 1] = v - 2; d[i + 2] = v - 9; d[i + 3] = 255;
      }
      ctx.putImageData(frame, 0, 0);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      aria-hidden="true"
      className={"tv-static" + (fading ? " fading" : "")}
    />
  );
}
