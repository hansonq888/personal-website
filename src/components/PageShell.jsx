import { Link, NavLink, useLocation } from "react-router-dom";
import { INTER, LIGHT } from "../data/media";

const PAGES = [
  { to: "/about", label: "About" },
  { to: "/experiences", label: "Experience" },
  { to: "/projects", label: "Projects" },
  { to: "/skills", label: "Skills" },
];

/* The frame for every inner page, in the front page's voice: the name on the
   left as the way home, the same four light links on the right, edge-to-edge
   with the home page's small margins and no footer. */
export default function PageShell({ children }) {
  // a visitor who arrived from the dark sheet goes back there, not to /new
  const home = useLocation().state?.from || "/new";
  return (
    <div className="min-h-screen min-h-[100dvh] w-full overflow-x-clip min-w-0 flex flex-col bg-white text-black">
      <header className="sticky top-0 z-50 h-12 px-3 sm:px-4 flex justify-between items-center gap-4 bg-white/90 backdrop-blur-md">
        <Link to={home} className="text-sm tracking-tight hover:opacity-60 transition-opacity" style={{ fontFamily: INTER, fontWeight: 700 }}>
          Hanson Qin
        </Link>
        <nav className="flex items-center gap-4 sm:gap-7">
          {PAGES.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={LIGHT}
              className={({ isActive }) =>
                "text-sm tracking-wide underline-offset-2 transition-colors " +
                (isActive ? "text-black underline" : "text-black/50 hover:text-black")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 min-h-0 min-w-0 max-w-full overflow-x-clip flex flex-col">{children}</main>
    </div>
  );
}
