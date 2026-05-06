import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { authFailure, authStart, authSuccess, clearError, logout as logoutAction } from '../store/authSlice';
import { loginUser, registerUser } from '../services/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, isAuthenticated,user } = useSelector((state: RootState) => state.auth);

  const login = useCallback(
    async (email: string, password: string) => {
      dispatch(authStart());
      try {
        const data = await loginUser({ email, password });
        dispatch(authSuccess(data));
      } catch (e) {
        dispatch(authFailure(e instanceof Error ? e.message : 'Login failed'));
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      dispatch(authStart());
      try {
        const data = await registerUser({ username, email, password });
        dispatch(authSuccess(data));
      } catch (e) {
        dispatch(authFailure(e instanceof Error ? e.message : 'Registration failed'));
      }
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return { 
    user,
    login, 
    register, 
    logout, 
    loading: isLoading, 
    error: error ?? undefined,
    isAuthenticated,
    clearAuthError 
  };
};
