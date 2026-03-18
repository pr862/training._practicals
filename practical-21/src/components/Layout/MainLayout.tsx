import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Player from './Player';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <div className="flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>

      <Player />
    </div>
  );
};

export default MainLayout;