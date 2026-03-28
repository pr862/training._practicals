import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAuthApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { BaseForm, FormField } from '../ui/BaseForm';
import { useFormValidation, validationRules } from '../../hooks/useFormValidation';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { errors, validate, clearError } = useFormValidation({
    email: validationRules.required('Email is required'),
    password: validationRules.required('Password is required'),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const isValid = validate({ email, password });
    if (!isValid) return;
    
    setLoading(true);
    try {
      const res = await adminAuthApi.login(email, password);
      login(res.token, res.user);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err?.message ?? 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseForm
      onSubmit={onSubmit}
      isLoading={loading}
      submitText="Sign In to Admin Panel"
      fullWidthButton={true}
      cancelText=""
      onCancel={() => {}}
    >
      <FormField>
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
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
        <span>New admin?</span>
        <Link 
          className="font-medium text-teal-300 hover:text-teal-200 hover:underline transition-colors" 
          to="/register"
        >
          Create an admin account
        </Link>
      </div>
    </BaseForm>
  );
}
