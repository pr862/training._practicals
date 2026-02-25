import { defineStore } from 'pinia';
import { authAPI } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authAPI.login({ email, password });        
        this.token = response.data.token;
        this.user = response.data.user;
        
        localStorage.setItem('token', this.token!);
        localStorage.setItem('user', JSON.stringify(this.user));
        
        return true;
      } catch (error: any) {
        console.error('Login error:', error);
        this.error = error.response?.data?.message || 'Login failed';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(name: string, email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authAPI.registerAdmin({ name, email, password });
        
        this.token = response.data.token;
        this.user = response.data.user;
        
        localStorage.setItem('token', this.token!);
        localStorage.setItem('user', JSON.stringify(this.user));
        
        return true;
      } catch (error: any) {
        console.error('Registration error:', error);
        this.error = error.response?.data?.message || 'Registration failed';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async registerUser(name: string, email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authAPI.registerUser({ name, email, password });
        
        this.token = response.data.token;
        this.user = response.data.user;
        
        localStorage.setItem('token', this.token!);
        localStorage.setItem('user', JSON.stringify(this.user));
        
        return true;
      } catch (error: any) {
        console.error('Registration error:', error);
        this.error = error.response?.data?.message || 'Registration failed';
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

