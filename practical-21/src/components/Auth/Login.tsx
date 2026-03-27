import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../UI/Input';
import { BaseForm, FormField } from '../UI/BaseForm';
import { useFormValidation, validationRules } from '../../hooks/useFormValidation';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, isAuthenticated, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { errors, validate, clearError } = useFormValidation({
    email: validationRules.required('Email is required'),
    password: validationRules.required('Password is required'),
  });

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from as { pathname?: string; search?: string } | undefined;
      const fromPath =
        typeof from?.pathname === 'string'
          ? `${from.pathname}${from.search ?? ''}`
          : undefined;
      navigate(fromPath ?? '/', { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    
    const isValid = validate({ email, password });
    if (!isValid) return;
    
    await login(email, password);
  };

  return (
    <BaseForm
      onSubmit={handleSubmit}
      isLoading={loading}
      submitText="Sign In"
      fullWidthButton={true}
      cancelText=""
      onCancel={() => {}}
    >
      <FormField>
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            clearError('email');
            clearAuthError();
          }}
          autoComplete="email"
          placeholder="your.email@company.com"
          error={errors.email}
        />
      </FormField>
      
      <FormField>
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
            clearError('password');
            clearAuthError();
          }}
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password}
        />
      </FormField>
      
      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}
      
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>New to MusicStream?</span>
        <Link 
          className="font-medium text-xs text-teal-300 hover:text-teal-200 hover:underline transition-colors" 
          to="/register"
        >
          Create an Account
        </Link>
      </div>
    </BaseForm>
  );
};

export default Login;