import { loginUser } from "../services/auth";
import { saveUser } from "../services/user";
import { Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validation";
import { Input } from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useAuthForm } from "../hooks/useAuthForm";
import { Mail, Lock, MessagesSquare } from "lucide-react";

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
      const res = await loginUser(values.email, values.password);
      await saveUser(res.user.uid, res.user.email!, res.user.displayName ?? undefined, res.user.photoURL);
    } catch {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-md shadow-blue-500/30">
            <MessagesSquare className="size-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome back </h2>
          <p className="mt-3 text-base text-slate-500">Sign in to start your conversation.</p>
        </div>

        <form className="mt-10 space-y-5" onSubmit={handleLogin}>
          <div className="space-y-4">
            <Input label="Email Address" type="email" placeholder="name@example.com" value={values.email} error={errors.email}
              icon={<Mail className="size-5 text-slate-400" />}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <Input label="Password" type="password" placeholder="••••••••" value={values.password} error={errors.password}
              icon={<Lock className="size-5 text-gray-400" />}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="mt-8 border-t border-slate-100 pt-6 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}<Link to="/register" className="font-bold text-blue-500 hover:text-blue-500/80">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
