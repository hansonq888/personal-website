import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import { LoadingScreen } from "./components/LoadingScreen";
import "./index.css";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/projects", element: <Projects />},
      { path: "/projects", element: <Projects />},
      {path: "/projects/:id", element: <ProjectDetail />}
    ],
  },
]);

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const checkLoadingComplete = () => {
      // Check if all critical resources are loaded
      const images = document.querySelectorAll('img');
      const videos = document.querySelectorAll('video');
      const totalResources = images.length + videos.length;
      let loadedResources = 0;

      if (totalResources === 0) {
        // If no resources to load, complete immediately
        setLoadingProgress(100);
        return;
      }

      const updateProgress = () => {
        loadedResources++;
        const progress = Math.round((loadedResources / totalResources) * 100);
        setLoadingProgress(progress);
        
        if (loadedResources >= totalResources) {
          // All resources loaded, complete loading
          setTimeout(() => setIsLoaded(true), 500); // Small delay for smooth transition
        }
      };

      // Check images
      images.forEach(img => {
        if (img.complete) {
          updateProgress();
        } else {
          img.addEventListener('load', updateProgress);
          img.addEventListener('error', updateProgress); // Count errors as "loaded"
        }
      });

      // Check videos
      videos.forEach(video => {
        if (video.readyState >= 3) { // HAVE_FUTURE_DATA
          updateProgress();
        } else {
          video.addEventListener('canplaythrough', updateProgress);
          video.addEventListener('error', updateProgress);
        }
      });

      // Fallback: complete loading after 3 seconds regardless
      setTimeout(() => {
        if (!isLoaded) {
          setLoadingProgress(100);
          setIsLoaded(true);
        }
      }, 3000);
    };

    // Start checking after a short delay to allow initial render
    const timer = setTimeout(checkLoadingComplete, 100);
    
    return () => clearTimeout(timer);
  }, [isLoaded]);

  return (
    <>
      {!isLoaded ? (
        <LoadingScreen onComplete={() => setIsLoaded(true)} progress={loadingProgress} />
      ) : (
        <div
          className={`min-h-screen transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } bg-black text-gray-100`}
        >
          <RouterProvider router={router} />
        </div>
      )}
    </>
  );
}

export default App;
