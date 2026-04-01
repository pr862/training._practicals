import React, { useEffect, useState, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Menu,
  X,
  User,
  Heart,
  Music2,
  LogOut,
  AlertTriangle,
} from "lucide-react";

import { logout } from "../../store/authSlice";
import type { AppDispatch, RootState } from "../../store/store";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/app/tracks", label: "Tracks" },
    { path: "/app/artists", label: "Artists" },
    { path: "/app/albums", label: "Albums" },
    { path: "/app/playlists", label: "Playlists" },
  ];

  const handleLogout = useCallback(() => {
    setIsLogoutConfirmOpen(true);
  }, []);

  const confirmLogout = useCallback(() => {
    dispatch(logout());
    navigate("/", { replace: true });
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsProfileOpen(false);
    setSearchQuery("");
    setIsLogoutConfirmOpen(false);
  }, [dispatch, navigate]);

  const cancelLogout = useCallback(() => {
    setIsLogoutConfirmOpen(false);
  }, []);

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) {
      if (location.pathname === "/") {
        navigate("/", { replace: true });
      }
      setIsSearchOpen(false);
      setIsMenuOpen(false);
      return;
    }

    if (location.pathname === "/") {
      navigate(
        { pathname: "/", search: `?q=${encodeURIComponent(q)}` },
        { replace: true }
      );
      setIsSearchOpen(false);
      setIsMenuOpen(false);
      return;
    }

    navigate(`/app/search?q=${encodeURIComponent(q)}`);
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    if (location.pathname === "/" || location.pathname === "/app/search") {
      setSearchQuery(q);
    }
    if (location.pathname !== "/app/search") {
      setIsProfileOpen(false);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    const close = () => setIsProfileOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800 shadow-lg shadow-teal-500/20">
      <div className="w-full mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              MusicStream
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch()
                }
                placeholder="Search songs..."
                className="pl-10 pr-4 py-2 w-56 bg-gray-900/50 text-white rounded-lg border border-gray-600 outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
              />
            </div>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/app/favourites")}
                  className="text-gray-400 hover:text-pink-400 transition-all duration-200 p-1 rounded-full hover:bg-gray-800"
                >
                  <Heart className="w-5 h-5" />
                </button>

                <div
                  className="relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setIsProfileOpen((v) => !v)
                    }
                    className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-all duration-200 shadow-md hover:shadow-teal-500/25"
                  >
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-gray-950 shadow-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-red-300 hover:bg-white/5 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 px-6 py-2 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1 rounded-full hover:bg-gray-800 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-full hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-400" />
              ) : (
                <Menu className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="md:hidden pb-3">
            <input
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" && handleSearch()
              }
              placeholder="Search..."
              className="w-full px-4 py-2 bg-gray-900/50 text-white rounded-xl ring-1 ring-gray-700 focus:ring-teal-500 backdrop-blur-sm transition-all"
            />
          </div>
        )}

        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 bg-gray-900/50 backdrop-blur-md rounded-b-2xl pt-4">
            {navLinks.map((link) => (
              <div
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsMenuOpen(false);
                }}
                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3"
              >
                {link.label}
              </div>
            ))}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign In
              </button>
            )}
          </div>
        )}

        {isLogoutConfirmOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center pt-20 p-4">
            <div className="bg-gray-900 rounded-xl border border-white/10 p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <div>
                  <h3 className="text-white font-semibold">
                    Confirm Logout
                  </h3>
                  <p className="text-gray-400">
                    Are you sure you want to logout?
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-2 bg-gray-800 text-gray-400 hover:bg-gray-700 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;