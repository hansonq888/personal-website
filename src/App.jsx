import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import "./App.css";
import "./index.css";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Experiences from "./pages/Experiences";
import Skills from "./pages/Skills";
import ProjectDetail from "./pages/ProjectDetail";
import Sheet from "./pages/Sheet";
import Magazine from "./pages/Magazine";

const router = createBrowserRouter([
  // the long-scroll sheet is full-bleed: it sits outside Layout so it gets no
  // navbar or footer of its own
  // the live site stays on the sheet while the light redesign is tried out at /new
  { path: "/", element: <Sheet /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/new", element: <Magazine /> },
      { path: "/sheet", element: <Navigate to="/" replace /> },
      { path: "/magazine", element: <Navigate to="/new" replace /> },
      { path: "/classic", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/projects", element: <Projects /> },
      { path: "/experiences", element: <Experiences /> },
      { path: "/skills", element: <Skills /> },
      { path: "/projects/:id", element: <ProjectDetail /> },
    ],
  },
]);

// No loading screen: the sheet opens on its own paper intro, which covers the
// page while the fonts settle, and every other route simply renders.
function App() {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-full bg-white text-black">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
