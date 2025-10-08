import React from "react";
import { Outlet, NavLink } from "react-router-dom"; {/* Outlet acts as a placeholder, NavLink connects  */} 
import Navbar from "./Navbar";  // assuming Navbar.jsx is in the same folder or adjust path
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Navbar />  {/* Use the full-featured Navbar here */}
      <main className="flex-grow"> 
        <Outlet /> {/* This renders child routes. Outlet is a placeholder */} 
      </main>
      <Footer />
    </div>
  );
}