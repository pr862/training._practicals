import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { loginThunk, registerThunk, logoutThunk, clearError } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

const login = useCallback(async (email: string, password: string) => {
    await dispatch(loginThunk({ email, password }));
  }, [dispatch]);

  const register = useCallback(async (username: string, email: string, password: string) => {
    await dispatch(registerThunk({ username, email, password }));
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutThunk());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return { 
    login, 
    register, 
    logout, 
    loading: isLoading, 
    error: error ?? undefined,
    isAuthenticated,
    clearAuthError 
  };
};

