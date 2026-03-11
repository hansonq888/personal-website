import React, { useRef, useEffect } from "react";
import { Outlet, useOutlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import CursorTrail from "./CursorTrail";

export default function Layout() {
  const outlet = useOutlet();
  const clickSoundRef = useRef(null);

  useEffect(() => {
    clickSoundRef.current = new Audio("/tic.wav");
    return () => {
      if (clickSoundRef.current) {
        clickSoundRef.current.pause();
        clickSoundRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    const playClickSound = (e) => {
      const target = e.target.closest("button, a[href]");
      if (target && clickSoundRef.current) {
        const sound = clickSoundRef.current;
        sound.volume = 0.45;
        sound.currentTime = 0;
        sound.play().catch(() => {});
      }
    };
    document.addEventListener("click", playClickSound, true);
    return () => document.removeEventListener("click", playClickSound, true);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen min-h-[100dvh] min-w-0 overflow-x-hidden max-w-full bg-white">
      <CursorTrail />
      <main className="flex-1 min-w-0 relative flex flex-col z-[2] overflow-x-hidden overflow-y-auto max-w-full">
        {outlet}
      </main>
      <Analytics />
    </div>
  );
}
