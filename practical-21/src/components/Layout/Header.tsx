import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../../store/authSlice';
import Input from '../UI/Input';
import Button from '../UI/Button';
import type { AppDispatch, RootState } from '../../store/store';

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg p-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            MusicStream
          </h1>
        </div>
        <div className="flex-1 max-w-md mx-8">
          <Input 
            placeholder="Search songs, artists..." 
            className="w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span>Hi, {user?.name}</span>
              <Button onClick={handleLogout} variant="danger" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm">Login</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
