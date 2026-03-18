import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../../store/authSlice';
import Input from '../UI/Input';
import Button from '../UI/Button';
import myImage from '../../assets/home.svg';
import type { AppDispatch, RootState } from '../../store/store';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const navItems = [
    { to: '/app', label: 'Home' },
    { to: '/app/tracks', label: 'Tracks' },
    { to: '/app/artists', label: 'Artists' },
    { to: '/app/albums', label: 'Albums' },
    { to: '/app/playlists', label: 'Playlists' },
  ];

  if (isAuthenticated) {
    navItems.push({ to: '/app/favourites', label: 'Favourites' });
  }

  const handleLogout = () => {
    dispatch(logoutThunk());
    setIsOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gradient-to-br from-gray-950 to-teal-950 text-white shadow-lg sticky top-0 z-50">
      <div className="w-full px-4">

        {/* TOP BAR */}
        <div className="flex items-center py-4 md:py-3 w-full">

          {/* Logo */}
          <div className="flex items-center mr-4">
            <NavLink
              to="/"
              className="text-2xl font-bold bg-gradient-to-br from-teal-500 to-teal-600 bg-clip-text text-transparent"
            >
              MusicStream
            </NavLink>
          </div>

          {/* Button + Search */}
          <div className="flex items-center gap-3 flex-1 mx-6">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center rounded-full w-12 h-12 border border-gray-600"
            >
              <img src={myImage} alt="home" />
            </button>

            <Input
              placeholder="Search songs, artists..."
              className="flex-1 w-full bg-gradient-to-br from-gray-950 to-teal-950 border-gray-600 text-gray-100 placeholder-gray-500 focus:ring-0"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm">Hi, {user?.name || 'User'}</span>
                <Button onClick={handleLogout} variant="danger" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  size="sm"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  variant="primary"
                  size="sm"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center ml-2">
            <button
              onClick={toggleMenu}
              className="p-2 rounded hover:bg-gray-700"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden mb-3">
          <Input
            placeholder="Search..."
            className="w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          />
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-2 border-t border-gray-700">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <div className="px-3 py-2 flex items-center justify-between">
                <span>Hi, {user?.name || 'User'}</span>
                <Button onClick={handleLogout} variant="danger" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="px-3 space-y-2 pt-2">
                <Button
                  onClick={() => {
                    navigate('/login');
                    setIsOpen(false);
                  }}
                  className="w-full"
                  variant="outline"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    navigate('/register');
                    setIsOpen(false);
                  }}
                  className="w-full"
                  variant="primary"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;