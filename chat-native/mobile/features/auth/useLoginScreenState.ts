import { useAuthForm } from "./useAuthForm";
import { loginUser } from "../../../packages/data/auth/service";
import { saveUser } from "../../../packages/data/user/service";
import { validateEmail, validatePassword } from "./validation";

export type LoginFormValues = {
  email: string;
  password: string;
};

export function useLoginScreenState() {
  const form = useAuthForm<LoginFormValues>({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    const emailError = validateEmail(form.values.email);
    const passwordError = validatePassword(form.values.password);

    if (emailError || passwordError) {
      form.setErrors({
        email: emailError || "",
        password: passwordError || "",
      });
      return;
    }

    try {
      form.setLoading(true);
      const res = await loginUser(form.values.email, form.values.password);

      await saveUser(
        res.user.uid,
        res.user.email!,
        res.user.displayName ?? undefined,
        res.user.photoURL ?? undefined
      );
    } catch {
      form.setErrors({
        email: "Invalid email.",
        password: "Invalid password.",
      });
    } finally {
      form.setLoading(false);
    }
  };

  return {
    ...form,
    handleLogin,
  };
}

