import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    
    <div className="w-full bg-gradient-to-br from-indigo-300 via-white to-pink-300 transition-all duration-500">
      {/* Navbar */}
      <nav
        className={`left-0 right-0 fixed top-0 w-full h-16 z-50 transition-all duration-400 ${
          scrolled ? "bg-white shadow-md" : "bg-transparent"
        } backdrop-blur-lg`}
      >
        <div className="max-w-8xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="text-xl font-bold text-indigo-700 hover:scale-105 transition-transform">
                GenApp
            </div>
            <button className="p-2 rounded-md hover:bg-indigo-100 focus:outline-none" aria-label="Toggle menu">
                <Menu className="hover:scale-105 transition-transform w-6 h-6 text-indigo-700 hover:text-indigo-900 transition-colors" />
            </button>
        </div>
        
      </nav>
    </div>
  );
}