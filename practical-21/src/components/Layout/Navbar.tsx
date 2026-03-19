import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../../store/authSlice';
import Input from '../UI/Input';
import Button from '../UI/Button';
import homeIcon from '../../assets/home.svg';
import type { AppDispatch, RootState } from '../../store/store';

const Navbar: React.FC = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logoutThunk());
    setProfileOpen(false);
  };

  const toggleProfile = () => setProfileOpen(!profileOpen);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="h-16 backdrop-blur-2xl bg-gradient-to-r from-gray-900/95 via-gray-800/90 to-gray-900/95 border-b border-teal-900/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 flex items-center px-4 lg:px-6 transition-all duration-500">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        
        <NavLink
          to="/app"
          className="text-2xl lg:text-2xl font-black bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 bg-clip-text text-transparent hover:scale-110 active:scale-95 transition-all duration-300 select-none"
        >
          MusicStream
        </NavLink>

        <div className="flex-1 max-w-lg mx-4 lg:mx-8 hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/app')}
            className="flex-shrink-0 p-2 rounded-full bg-gradient-to-r from-gray-900/95 via-gray-800/90 to-gray-900/95 border border-teal-500/30 hover:border-teal-400/50 shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
            title="Go to Home"
          >
            <img 
              src={homeIcon} 
              alt="Home" 
              className="w-5 h-5 md:w-6 md:h-6 opacity-90 hover:opacity-100 transition-all"
            />
          </button>

          <div className="relative w-full">
            <Input
              placeholder="Search for songs, artists, albums..."
              className="w-full pl-14 pr-16 py-4 text-lg backdrop-blur-xl !bg-transparent border border-teal-800/40 hover:border-teal-700/60 focus:border-teal-500/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500/20 rounded-3xl transition-all duration-300"
            />

            <img 
              src="/src/assets/search.svg" 
              alt="Search" 
              className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            />
            <img 
              src="/src/assets/browser.svg" 
              alt="Browser" 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            {isAuthenticated ? (
              <>
                <button
                  onClick={toggleProfile}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-2xl hover:shadow-emerald-400/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ring-4 ring-teal-500/20 hover:ring-emerald-400/40"
                >
                  {user?.name ? getInitials(user.name) : '👤'}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-72 backdrop-blur-3xl bg-gradient-to-b from-gray-900/98 to-gray-800/90 border border-teal-800/50 rounded-3xl shadow-2xl p-6 max-h-80 overflow-auto">
                    <div className="text-teal-300 text-lg font-bold mb-4 pb-3 border-b border-teal-800/40">
                      Welcome back! 👋
                    </div>
                    <div className="text-sm text-teal-200 mb-4">
                      Hi, <span className="font-semibold text-teal-100">{user?.name || 'User'}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-4 py-4 px-6 rounded-2xl text-teal-200 hover:bg-gradient-to-r hover:from-teal-600/30 hover:to-emerald-600/30 hover:text-white font-semibold transition-all duration-300 group"
                    >
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="group-hover:translate-x-1 transition-transform">Sign Out</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-x-4 gap-2">
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  size="md"
                  className="min-w-[90px]"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  variant="primary"
                  size="md"
                  className="min-w-[90px]"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;