import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { useConfirm } from '../components/ui/ConfirmProvider';
import {
  LayoutDashboard,
  Users2,
  User2,
  GalleryVerticalEnd,
  AudioLinesIcon,
  ListMusicIcon,
  LogOut,
} from 'lucide-react';

const linkClass = (isActive: boolean): string =>
  [
    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
    isActive
      ? 'text-white shadow-lg hover:shadow-teal-500/10 bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 hover:brightness-110'
      : 'text-white/80 hover:bg-gradient-to-r from-teal-700/90 via-teal-800/90 to-emerald-800/90 hover:text-white hover:shadow-lg',
  ].join(' ');

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const confirm = useConfirm();

  const handleLogout = async () => {
    const confirmed = await confirm.confirm({
      title: 'Confirm Sign Out',
      description: 'Are you sure you want to sign out? Any unsaved changes will be lost.',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (confirmed) {
      logout();
      onClose?.();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 shrink-0 flex flex-col
          bg-gradient-to-b from-teal-950 to-black
          border-r border-neutral-900 px-4 py-6 text-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="px-2">
          <div className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
            Music Admin
          </div>
          <div className="mt-1 text-xs text-white/70 font-medium">
            Admin Dashboard
          </div>
        </div>

        <nav className="mt-8 space-y-1 flex-1">
          <NavLink to="/" end className={({ isActive }) => linkClass(isActive)} onClick={onClose}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => linkClass(isActive)} onClick={onClose}>
            <Users2 className="w-5 h-5" />
            Users
          </NavLink>
          <NavLink to="/artists" className={({ isActive }) => linkClass(isActive)} onClick={onClose}>
            <User2 className="w-5 h-5" />
            Artists
          </NavLink>
          <NavLink to="/albums" className={({ isActive }) => linkClass(isActive)} onClick={onClose}>
            <GalleryVerticalEnd className="w-5 h-5" />
            Albums
          </NavLink>
          <NavLink to="/tracks" className={({ isActive }) => linkClass(isActive)} onClick={onClose}>
            <AudioLinesIcon className="w-5 h-5" />
            Tracks
          </NavLink>
          <NavLink to="/playlists" className={({ isActive }) => linkClass(isActive)} onClick={onClose}>
            <ListMusicIcon className="w-5 h-5" />
            Playlists
          </NavLink>
        </nav>

        <div className="mt-auto pt-6">
          <div className="flex items-center gap-4 rounded-xl bg-white/5 px-4 py-4 border border-white/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-bold shadow-inner">
              {(user?.name ?? 'A').slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-white">{user?.name ?? 'Admin'}</div>
              <div className="text-xs text-white/70 truncate">
                {user?.email ?? 'Signed in'}
              </div>
            </div>
          </div>

          <Button
            className="mt-4 w-full rounded-lg font-semibold"
            variant="danger"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
};