import { registerUser } from "../firebase/auth";
import { db } from "../firebase/config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "../utils/validation";
import { Input } from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useAuthForm } from "../hooks/useAuthForm";
import { Mail, User, Lock } from "lucide-react"

export default function Register() {
  const { values, errors, setErrors, loading, setLoading, handleChange } = useAuthForm({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
    };

    if (Object.values(newErrors).some((err) => err)) {
      setErrors(newErrors as any);
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser(values.email, values.password);
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        email: res.user.email,
        name: values.name || "New User",
        photoURL: "",
        createdAt: serverTimestamp(),
      });
      alert("User Registered Successfully");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join the community today</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <Input label="Full Name" type="text" placeholder="Your name" value={values.name} error={errors.name}
              icon={<User className="w-5 h-5 text-gray-400" />} 
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Input label="Email Address" type="email" placeholder="name@example.com" value={values.email} error={errors.email}
              icon={<Mail className="w-5 h-5 text-gray-400" />}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <Input label="Password" type="password" placeholder="••••••••" value={values.password} error={errors.password}
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <Input label="Confirm Password" type="password" placeholder="••••••••" value={values.confirmPassword} error={errors.confirmPassword}
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "Register"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already have an account? <Link to="/" className="text-blue-600">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
