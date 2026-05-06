import React from 'react';
import AuthLayout from '../components/Layout/AuthLayout';
import Register from '../components/Auth/Register';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout title="Create an account" subtitle="Set up admin access for this panel.">
      <Register />
    </AuthLayout>
  );
};

export default RegisterPage;

