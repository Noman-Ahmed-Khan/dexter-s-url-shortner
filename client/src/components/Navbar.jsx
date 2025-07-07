import React, { useState, useEffect } from "react";
import { Menu, X, LogOut, User, Settings, Home, Info, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authcontext";
import { getCsrfToken, resetCsrfToken } from "../utils/func";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, refetchUser, clearUser } = useAuth();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
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
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Logout failed");

      resetCsrfToken();
      clearUser();
      navigate("/login");
    } catch (err) {
      // console.error(err);
    }
  };

  const NavLink = ({ to, label, icon: Icon, onClick, active }) => (
    <button
      onClick={onClick || (() => navigate(to))}
      className={`group relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out ${
        active
          ? "text-slate-900 bg-slate-100/80"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/80"
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out" />
    </button>
  );

  const MobileNavLink = ({ to, label, icon: Icon, onClick }) => (
    <button
      onClick={onClick || (() => navigate(to))}
      className="flex items-center space-x-3 w-full px-4 py-3 text-left text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all duration-150 ease-in-out"
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span className="font-medium">{label}</span>
    </button>
  );

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-in-out ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/20"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Sparkles className=" text-white text-sm" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-200">
                  GenApp
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/" label="Home" icon={Home} active={isActive("/")} />
              <NavLink to="/About" label="About" icon={Info} active={isActive("/About")} />
              {!loading && isAdmin && (
                <NavLink to="/Dashboard" label="Dashboard" icon={Settings} active={isActive("/Dashboard")} />
              )}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-3">
              {!loading && !user && (
                <button
                  onClick={() => navigate("/Login")}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Login
                </button>
              )}
              {!loading && !user && (
                <button
                  onClick={() => navigate("/register")}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:to-blue-700 hover:from-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Create Account
                </button>
              )}
              
              {!loading && user && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-slate-50 rounded-lg">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">
                      {user.name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-150"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            menuOpen
              ? "max-h-96 opacity-100 border-t border-slate-200/20"
              : "max-h-0 opacity-0"
          } overflow-hidden bg-white/95 backdrop-blur-md`}
        >
          <div className="px-4 py-3 space-y-1">
            <MobileNavLink to="/" label="Home" icon={Home} />
            <MobileNavLink to="/About" label="About" icon={Info} />
            {!loading && isAdmin && (
              <MobileNavLink to="/Dashboard" label="Dashboard" icon={Settings} />
            )}
            
            {!loading && user && (
              <div className="border-t border-slate-200/50 pt-3 mt-3">
                <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                  <User className="w-5 h-5 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {user.name || user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-150"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}

            {!loading && !user && (
              <div className="border-t border-slate-200/50 pt-3 mt-3">
                <button
                  onClick={() => navigate("/Login")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                >
                  Login
                </button>
              </div>
            )}
            {!loading && !user && (
              <div className="border-t border-slate-200/50 pt-3 mt-3">
                <button
                  onClick={() => navigate("/register")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                >
                  Create Account
                </button>
              </div>
            )}
            
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-t border-red-200/50 px-4 py-3">
            <div className="text-red-600 text-sm text-center font-medium">{error}</div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16" />
    </>
  );
}
