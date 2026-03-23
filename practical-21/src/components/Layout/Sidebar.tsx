import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

const Sidebar: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

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

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 h-screen overflow-y-auto">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block py-2 px-4 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'hover:bg-gray-800 text-gray-300'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
