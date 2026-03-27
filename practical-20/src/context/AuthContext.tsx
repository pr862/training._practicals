import React, { createContext, useContext, useMemo, useState } from 'react';
import type { AuthUser } from '../types/auth';
import { tokenStorage } from '../lib/storage';

type AuthState = {
  token: string | null;
  user: AuthUser | null;
};

type AuthContextValue = AuthState & {
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(tokenStorage.get());
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      login: (newToken, newUser) => {
        tokenStorage.set(newToken);
        setToken(newToken);
        setUser(newUser);
      },
      logout: () => {
        tokenStorage.clear();
        setToken(null);
        setUser(null);
      },
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

