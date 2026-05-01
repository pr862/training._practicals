import { loginUser } from "../firebase/auth";
import { Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validation";
import { Input } from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useAuthForm } from "../hooks/useAuthForm";
import { Mail, Lock } from "lucide-react"

export function Login() {
  const { values, errors, setErrors, loading, setLoading, handleChange } = useAuthForm({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      setLoading(true);
      await loginUser(values.email, values.password);
    } catch {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <Input label="Email Address" type="email" placeholder="name@example.com" value={values.email} error={errors.email}
              icon={<Mail className="w-5 h-5 text-gray-400" />}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <Input label="Password" type="password" placeholder="••••••••" value={values.password} error={errors.password}
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="text-center text-sm">
          <p className="text-gray-600">
            Don't have an account? <Link to="/register" className="text-blue-600">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
