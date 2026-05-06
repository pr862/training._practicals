import React from 'react';
import AuthLayout from '../components/Layout/AuthLayout';
import Login from '../components/Auth/Login';

const LoginPage: React.FC = () => {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to the admin panel.">
      <Login />
    </AuthLayout>
  );
};

export default LoginPage;

