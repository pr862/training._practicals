import { useEffect, useState, type ChangeEvent } from "react";
import { Camera, Lock, Mail, MessagesSquare, User } from "lucide-react";
import { registerUser, updateUserProfile } from "../services/auth";
import { saveUser } from "../services/user";
import { Link } from "react-router-dom";
import { validateName, validateEmail, validatePassword, validateConfirmPassword, validateProfileImage } from "../utils/validation";
import { Input } from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useAuthForm } from "../hooks/useAuthForm";
import { uploadImageToCloudinary } from "../services/upload";

export default function Register() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [imageError, setImageError] = useState("");

  const { values, errors, setErrors, loading, setLoading, handleChange } = useAuthForm({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
    };
  }, [profilePreview]);

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const error = validateProfileImage(file);
    setImageError(error);

    if (error || !file) {
      setProfileImage(null);
      setProfilePreview("");
      return;
    }

    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirmPassword: validateConfirmPassword(values.confirmPassword, values.password),
    };

    if (Object.values(newErrors).some((err) => err) || imageError) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser(values.email, values.password);
      const photoURL = profileImage ? await uploadImageToCloudinary(profileImage) : "";

      await updateUserProfile(res.user, {
        displayName: values.name,
        ...(photoURL ? { photoURL } : {}),
      });
      await saveUser(res.user.uid, res.user.email!, values.name, photoURL);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100 px-4 py-10">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-900 to-blue-900 text-white shadow-md shadow-blue-500/30">
            <MessagesSquare className="size-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900"> Create account</h2>
          <p className="mt-3 text-base text-slate-500">Add your details to start chatting.</p>
        </div>

        <form className="mt-10 space-y-5" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="profileImage"
                className="group relative flex size-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition hover:border-blue-500 hover:text-blue-100"
              >
                {profilePreview ? (
                  <img src={profilePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <User className="size-10" />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-blue-200/40 text-blue-500 opacity-0 transition group-hover:opacity-100">
                  <Camera className="size-6" />
                </span>
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleProfileImageChange}
              />
              {imageError && <p className="text-xs text-red-500">{imageError}</p>}
            </div>

            <Input label="Full Name" type="text" placeholder="Your name" value={values.name} error={errors.name}
              icon={<User className="size-5 text-gray-400" />}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Input label="Email Address" type="email" placeholder="name@example.com" value={values.email} error={errors.email}
              icon={<Mail className="size-5 text-gray-400" />}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <Input label="Password" type="password" placeholder="••••••••" value={values.password} error={errors.password}
              icon={<Lock className="size-5 text-gray-400" />}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <Input label="Confirm Password" type="password" placeholder="••••••••" value={values.confirmPassword} error={errors.confirmPassword}
              icon={<Lock className="size-5 text-gray-400" />}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "Register"}
          </Button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}<Link to="/" className="font-bold text-blue-800 hover:text-blue-900/80">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
