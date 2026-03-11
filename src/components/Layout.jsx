import React, { useRef, useEffect } from "react";
import { Outlet, useOutlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

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
    <div className="flex flex-col w-full h-screen min-h-[100dvh] min-h-[100vh] min-w-0 overflow-hidden overflow-x-hidden max-w-full bg-white">
      <main className="flex-1 min-h-0 min-w-0 relative flex flex-col z-[2] overflow-x-hidden overflow-y-auto max-w-full">
        {outlet}
      </main>
      <Analytics />
    </div>
  );
}
