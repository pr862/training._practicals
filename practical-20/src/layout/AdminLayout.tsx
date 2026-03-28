import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Button } from '../components/ui/Button';
import { Menu } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-full bg-neutral-950 text-white flex flex-col md:flex-row overflow-hidden">
      <div className="md:hidden p-4 border-b border-white/10">
        <Button variant="secondary" size="sm" onClick={() => setSidebarOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

