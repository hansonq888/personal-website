import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom"; {/* Outlet acts as a placeholder, NavLink connects  */} 
import Navbar from "./Navbar";  // assuming Navbar.jsx is in the same folder or adjust path
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isContactPage = location.pathname === '/contact';

  return (
    <div 
      className={`flex flex-col w-full min-h-screen ${
        (isHomePage || isContactPage) ? 'bg-cover bg-no-repeat bg-fixed' : ''
      }`}
      style={
        isHomePage
          ? { backgroundImage: "url('/HeroBackground.png')" }
          : isContactPage
            ? { backgroundImage: "url('/jellyfish.svg')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundAttachment: 'fixed' }
            : {}
      }
    >
      <Navbar />  {/* Use the full-featured Navbar here */}
      <main className="flex-grow"> 
        <Outlet /> {/* This renders child routes. Outlet is a placeholder */} 
      </main>
      {!isHomePage && <Footer />}
    </div>
  );
}