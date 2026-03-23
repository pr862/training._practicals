import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Player from './Player';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      <Navbar />

      <div className="flex-1 overflow-hidden">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      <Player />
    </div>
  );
};

export default MainLayout;

