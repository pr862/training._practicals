import AuthLayout from '../../layout/AuthLayout';
import LoginForm from '../../components/forms/LoginForm';
 
export default function Login() {
  return (
    <AuthLayout title="Sign in to your account">
      <LoginForm />
    </AuthLayout>
  );
}

