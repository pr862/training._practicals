import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../UI/Input';
import Button from '../UI/Button';


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, isAuthenticated, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from as { pathname?: string; search?: string } | undefined;
      const fromPath =
        typeof from?.pathname === 'string'
          ? `${from.pathname}${from.search ?? ''}`
          : undefined;
      navigate(fromPath ?? '/app', { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
<form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) clearAuthError();
          }}
          autoComplete="email"
          placeholder="name@company.com"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) clearAuthError();
          }}
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}
        <Button
          type="submit"
          variant="accent"
          className="h-11 w-full rounded-full"
          disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>New here?</span>
          <Link to="/register" className="ml-1 font-medium text-teal-900 hover:text-teal-800 hover:underline">Create an account</Link>
        </div>
      </form>
  );
};

export default Login;
