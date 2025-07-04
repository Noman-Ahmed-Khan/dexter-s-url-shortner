import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authcontext";
import { getCsrfToken,resetCsrfToken } from "../utils/func";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, refetchUser, clearUser } = useAuth();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const csrfToken = await getCsrfToken();

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/logout`, {
        method: "POST",
        headers: {
          "CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Logout failed");

      resetCsrfToken();       // clear JS cache
      clearUser();    // refresh auth state
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
    const MenuButton = ({ to, label, onClick }) => (
      <button
        onClick={onClick || (() => navigate(to))}
        className="text-xl w-full font-bold text-indigo-700 hover:scale-105 transition-transform p-2 rounded-md hover:bg-indigo-100"
        role="menuitem"
      >
        {label}
      </button>
    );

  const menuItems = (
    <>
      <MenuButton to="/About" label="About" />
      <MenuButton to="/" label="Home" />
      {!loading && isAdmin && <MenuButton to="/Dashboard" label="Dashboard" />}
      {!loading && !user && <MenuButton to="/Login" label="Login" />}
      {!loading && user && <MenuButton onClick={handleLogout} label="Logout" />}
    </>
  );

  return (
    <div className="w-full bg-gradient-to-br from-indigo-300 via-white to-pink-300">
      <nav
        className={`fixed top-0 left-0 right-0 w-full h-16 z-50 transition-all duration-500 ${scrolled ? "bg-white shadow-md" : "bg-transparent"} backdrop-blur-lg`}
      >
        <div className="mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-indigo-700 hover:scale-105 transition-transform">
            GenApp
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-12">{menuItems}</div>

          {/* Mobile menu */}
          <div className="relative md:hidden">
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="p-2 text-center rounded-md hover:bg-indigo-100"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-indigo-700 hover:text-indigo-900 hover:scale-105 transition-all" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg transition-opacity duration-300 z-50"
                role="menu"
              >
                {React.Children.map(menuItems.props.children, child =>
                  React.cloneElement(child, {
                    className:
                      "block w-full text-left px-4 py-2 text-indigo-700 font-bold hover:bg-indigo-100",
                  })
                )}
              </div>
            )}
          </div>
        </div>
        {error && (
          <div className="text-red-600 text-center text-sm mt-1">{error}</div>
        )}
      </nav>
    </div>
  );
}
