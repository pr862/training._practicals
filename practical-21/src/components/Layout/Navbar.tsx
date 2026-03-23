import React, { useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Menu,
  X,
  Bell,
  User,
  Heart,
  Music2,
  LogOut,
} from "lucide-react";

import { logoutThunk } from "../../store/authSlice";
import type { AppDispatch, RootState } from "../../store/store";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
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
    dispatch(logoutThunk());
  }, [dispatch]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/app/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800 shadow-lg shadow-teal-500/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-2 ring-transparent group-hover:ring-teal-400/50">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MusicStream</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className="text-gray-400 hover:text-white transition-all duration-200"
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
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search songs..."
                className="pl-10 pr-4 py-2 w-56 bg-gray-900/50 text-white rounded-lg outline-none focus:ring-2 focus:ring-teal-500/50 backdrop-blur-sm transition-all duration-200"
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

                <button className="text-gray-400 hover:text-teal-400 transition-all duration-200 p-1 rounded-full hover:bg-gray-800">
                  <Bell className="w-5 h-5" />
                </button>

                <div className="relative group">
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-all duration-200 shadow-md hover:shadow-teal-500/25">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
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

          {/* Mobile Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-1 rounded-full hover:bg-gray-800 transition-colors">
              <Search className="w-5 h-5 text-gray-400" />
            </button>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 rounded-full hover:bg-gray-800 transition-colors">
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-400" />
              ) : (
                <Menu className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-3">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-2 bg-gray-900/50 text-white rounded-xl ring-1 ring-gray-700 focus:ring-teal-500 backdrop-blur-sm transition-all"
            />
          </div>
        )}

        {/* Mobile Menu */}
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
      </div>
    </nav>
  );
};

export default Navbar;
