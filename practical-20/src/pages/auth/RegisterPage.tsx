import React from 'react';
import AuthLayout from '../../layout/AuthLayout';
import RegisterForm from '../../components/forms/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout title="Create an account" subtitle="Set up admin access for this panel.">
      <RegisterForm />
    </AuthLayout>
  );
};

