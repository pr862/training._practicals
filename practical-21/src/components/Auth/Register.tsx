import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../UI/Input';
import Button from '../UI/Button';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [localError, setLocalError] = useState<string | null>(null);
  const { register, loading, error, isAuthenticated, clearAuthError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    clearAuthError();
    setLocalError(null);
  }, [clearAuthError]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    await register(formData.username, formData.email, formData.password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) clearAuthError();
    if (localError) setLocalError(null);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-5">

        <Input
          label="Name"
          name="username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="name"
          placeholder="Your name"
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          placeholder="name@company.com"
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          placeholder="••••••••"
          required
        />

        <Input
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword || ''}
          onChange={handleChange}
          autoComplete="new-password"
          placeholder="Confirm your password"
          required
        />

        {localError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {localError}
          </div>
        ) : null}
        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}
        <Button
          type="submit"
          variant="accent"
          className="h-11 w-full rounded-full"
          disabled={loading}
        >
          {loading ? 'Creating…' : 'Create account'}
        </Button>
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Already have access?</span>
          <Link to="/login" className="font-medium text-teal-900 hover:text-teal-800 hover:underline">Sign in</Link>
        </div>
      </form>
  );
};


export default Register;
