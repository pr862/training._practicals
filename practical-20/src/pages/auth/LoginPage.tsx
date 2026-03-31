import React from 'react';
import AuthLayout from '../../layout/AuthLayout';
import LoginForm from '../../components/forms/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to the admin panel.">
      <LoginForm />
    </AuthLayout>
  );
};
