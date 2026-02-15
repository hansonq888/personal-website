import React, { useRef, useState, useCallback, useEffect } from "react";
import { Outlet, useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

const calmEase = [0.33, 1, 0.68, 1]; // gentle ease-out
const CURSOR_GLOW_LERP = 0.08;
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

  const audioRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
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

  useEffect(() => {
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audioRef.current = audio;
    audio.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMusicPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsMusicPlaying((prev) => !prev);
  }, [isMusicPlaying]);

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
      className={`flex flex-col w-full min-h-screen bg-cover bg-center bg-no-repeat ${isMinimalLayout ? "bg-black" : ""}`}
      style={
        isMinimalLayout
          ? {
              backgroundImage: "url(/purpleblurry.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              ...(isProjectsPage ? { backgroundAttachment: "fixed" } : {}),
            }
          : {}
      }
    >
      {/* Cursor-following glow — on every page */}
      <div
        className="pointer-events-none fixed rounded-full mix-blend-soft-light"
        style={{
          left: glowPos.x,
          top: glowPos.y,
          width: 200,
          height: 200,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.81) 0%, transparent 80%)",
          filter: "blur(100px)",
          zIndex: 0,
        }}
        aria-hidden
      />
      {/* Music toggle — bottom left, home page only */}
      <AnimatePresence mode="wait">
        {isHomePage && (
          <motion.button
            type="button"
            onClick={toggleMusic}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.5, duration: 0.6, ease: calmEase } }}
            exit={{ opacity: 0, x: 24, transition: { duration: 0.5, ease: calmEase } }}
            className="fixed bottom-4 md:bottom-8 left-4 md:left-12 z-20 geist-light text-white/75 text-xs border border-white/30 rounded-full px-4 py-2 hover:bg-white/10 transition-colors tracking-wider"
            aria-label={isMusicPlaying ? "Pause music" : "Play music"}
          >
            {isMusicPlaying ? "♪ Pause" : "♪ Play"}
          </motion.button>
        )}
      </AnimatePresence>
      {!isHomePage && !isContactPage && !isProjectsPage && !isAboutPage && <Navbar />}
      <main className="flex-1 min-h-0 relative flex flex-col">
        <AnimatePresence mode="wait" initial={false}>
          {outlet && (
            <motion.div
              key={location.pathname}
              custom={isContactPage || isProjectsPage || isAboutPage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-full w-full"
            >
              {outlet}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      {!isHomePage && !isContactPage && !isProjectsPage && !isAboutPage && (
        <div className="mt-auto flex-shrink-0">
          <Footer />
        </div>
      )}
    </div>
  );
}
