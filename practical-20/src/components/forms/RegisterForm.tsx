import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAuthApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { BaseForm, FormField } from '../ui/BaseForm';
import { useFormValidation, validationRules } from '../../hooks/useFormValidation';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { errors, validate, clearError } = useFormValidation({
    name: validationRules.required('Name is required'),
    email: validationRules.required('Email is required'),
    password: (value: string) => {
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters long';
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      return undefined;
    },
    confirmPassword: (value: string) => {
      if (!value) return 'Please confirm your password';
      if (value !== password) return 'Passwords do not match';
      return undefined;
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const isValid = validate({ name, email, password, confirmPassword });
    if (!isValid) return;
    
    setLoading(true);
    try {
      const res = await adminAuthApi.register(name, email, password);
      login(res.token, res.user);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseForm
      onSubmit={onSubmit}
      isLoading={loading}
      submitText="Create Admin Account"
      fullWidthButton={true}
      cancelText=""
      onCancel={() => {}}
    >
      <FormField>
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          placeholder="Your full name"
          error={errors.name}
        />
      </FormField>
      
      <FormField>
        <Input
          label="Email"
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
          autoComplete="new-password"
          placeholder="Create a strong password"
          error={errors.password}
        />
        <p className="mt-2 text-xs text-white/45">
          Password must be at least 8 characters with uppercase, lowercase, and numbers
        </p>
      </FormField>
      
      <FormField>
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Confirm your password"
          error={errors.confirmPassword}
        />
      </FormField>
      
      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}
      
      
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>Already have access?</span>
        <Link 
          className="font-medium text-teal-300 hover:text-teal-200 hover:underline transition-colors" 
          to="/login"
        >
          Sign in to your account
        </Link>
      </div>
    </BaseForm>
  );
}
