import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-indigo-300 via-white to-pink-300 transition-all duration-500">
      <nav
        className={`left-0 right-0 fixed top-0 w-full h-16 z-50 transition-all duration-400 ${
          scrolled ? "bg-white shadow-md" : "bg-transparent"
        } backdrop-blur-lg`}
      >
        <div className="mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-indigo-700 hover:scale-105 transition-transform">
            GenApp
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-12">
            <button className="text-xl font-bold text-indigo-700 hover:scale-105 transition-transform p-2 rounded-md hover:bg-indigo-100"
              onClick={()=>navigate('/About')}>
              About
            </button>
            <button className="text-xl font-bold text-indigo-700 hover:scale-105 transition-transform p-2 rounded-md hover:bg-indigo-100"
              onClick={()=>navigate('/')}>
              Home
            </button>
            <button className="text-xl font-bold text-indigo-700 hover:scale-105 transition-transform p-2 rounded-md hover:bg-indigo-100"
              onClick={()=>navigate('/Login')}>
              Login
            </button>
          </div>

          <div className="relative md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-md hover:bg-indigo-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-indigo-700 hover:text-indigo-900 hover:scale-105 transition-all" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg transition-opacity duration-300 z-50">
                <button className="block w-full text-left px-4 py-2 text-indigo-700 font-bold hover:bg-indigo-100"
                onClick={()=>navigate('/About')}>
                  About
                </button>
                <button className="block w-full text-left px-4 py-2 text-indigo-700 font-bold hover:bg-indigo-100"
                  onClick={()=>navigate('/')}>
                  Home
                </button>
                <button className="block w-full text-left px-4 py-2 text-indigo-700 font-bold hover:bg-indigo-100"
                onClick={()=>navigate('/Login')}>
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
