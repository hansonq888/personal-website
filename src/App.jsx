import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import { LoadingScreen } from "./components/LoadingScreen";
import "./index.css";

import { MusicProvider } from "./context/MusicContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Experiences from "./pages/Experiences";
import Skills from "./pages/Skills";
import ProjectDetail from "./pages/ProjectDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/projects", element: <Projects /> },
      { path: "/contact", element: <Contact /> },
      { path: "/experiences", element: <Experiences /> },
      { path: "/skills", element: <Skills /> },
      { path: "/projects/:id", element: <ProjectDetail /> },
    ],
  },
]);

const MAX_LOAD_WAIT_MS = 6000;
const MIN_LOAD_DISPLAY_MS = 600;

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const startTime = Date.now();

    const finishLoading = () => {
      if (cancelled) return;
      const elapsed = Date.now() - startTime;
      const wait = Math.max(0, MIN_LOAD_DISPLAY_MS - elapsed);
      setTimeout(() => {
        if (cancelled) return;
        setLoadingProgress(100);
        // LoadingScreen will call onComplete after progress hits 100 (after its 300ms delay)
      }, wait);
    };

    // Wait for fonts to be ready (includes custom @font-face fonts)
    const fontsReady = document.fonts && document.fonts.ready
      ? document.fonts.ready
      : Promise.resolve();

    fontsReady
      .then(() => {
        if (cancelled) return;
        return new Promise((resolve) => setTimeout(resolve, 80));
      })
      .then(() => {
        if (cancelled) return;
        finishLoading();
      })
      .catch(() => {
        if (!cancelled) finishLoading();
      });

    // Progress bar crawl while waiting
    const progressInterval = setInterval(() => {
      setLoadingProgress((p) => {
        if (p >= 90) return p;
        return Math.min(90, p + 4);
      });
    }, 120);

    // Fallback: force done after max wait
    const fallback = setTimeout(() => {
      if (!cancelled) {
        setLoadingProgress(100);
        setTimeout(() => setIsLoaded(true), 200);
      }
    }, MAX_LOAD_WAIT_MS);

    return () => {
      cancelled = true;
      clearInterval(progressInterval);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <>
      {!isLoaded ? (
        <LoadingScreen onComplete={() => setIsLoaded(true)} progress={loadingProgress} />
      ) : (
        <div
          className={`h-screen min-h-[100dvh] min-h-[100vh] overflow-hidden overflow-x-hidden w-full max-w-full transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } bg-black text-white`}
        >
          <MusicProvider>
            <RouterProvider router={router} />
          </MusicProvider>
        </div>
      )}
    </>
  );
}

export default App;
