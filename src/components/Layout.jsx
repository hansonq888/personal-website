import React, { useRef, useState, useCallback, useEffect } from "react";
import { Outlet, useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
const calmEase = [0.33, 1, 0.68, 1]; // gentle ease-out
const CURSOR_GLOW_LERP = 0.2;
const pageVariants = {
  initial: (isContact) => ({
    opacity: 0,
    x: isContact ? 24 : -24,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: calmEase },
  },
  exit: (isContact) => ({
    opacity: 0,
    x: isContact ? -24 : 24,
    transition: { duration: 0.5, ease: calmEase },
  }),
};

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();
  const isHomePage = location.pathname === "/";
  const isContactPage = location.pathname === "/contact";
  const isProjectsPage = location.pathname === "/projects";
  const isAboutPage = location.pathname === "/about";
  const isMinimalLayout = isHomePage || isContactPage || isProjectsPage || isAboutPage;

  const cursorRef = useRef({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

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

  const handleMouseMove = useCallback((e) => {
    cursorRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    let rafId;
    const tick = () => {
      const target = cursorRef.current;
      setGlowPos((prev) => ({
        x: prev.x + (target.x - prev.x) * CURSOR_GLOW_LERP,
        y: prev.y + (target.y - prev.y) * CURSOR_GLOW_LERP,
      }));
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className="flex flex-col w-full h-screen min-h-[100dvh] min-h-[100vh] min-w-0 overflow-hidden overflow-x-hidden max-w-full bg-black"
      style={{ background: "#000" }}
    >
      {/* Cursor-following glow — on every page */}
      <div
        className="pointer-events-none fixed rounded-full mix-blend-soft-light"
        style={{
          left: glowPos.x,
          top: glowPos.y,
          width: 260,
          height: 260,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.85) 35%, rgba(255, 255, 255, 0.45) 60%, transparent 78%)",
          filter: "blur(50px)",
          zIndex: 1,
        }}
        aria-hidden
      />
      <main className="flex-1 min-h-0 min-w-0 relative flex flex-col z-[2] overflow-x-hidden max-w-full">
        <AnimatePresence mode="wait" initial={false}>
          {outlet && (
            <motion.div
              key={location.pathname}
              custom={isContactPage || isProjectsPage || isAboutPage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-full w-full min-w-0 max-w-full overflow-x-hidden"
            >
              {outlet}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
