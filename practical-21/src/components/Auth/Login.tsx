import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../UI/Input';
import Button from '../UI/Button';


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

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
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="name@company.com"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          <a href="/register" className="ml-1 font-medium text-teal-900 hover:text-teal-800 hover:underline">Create an account</a>
        </div>
      </form>
  );
};

export default Login;
