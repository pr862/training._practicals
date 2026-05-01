import { useState } from "react";

export function useAuthForm<T>(initialValues: T) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as string]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return {
    values,
    errors,
    setErrors,
    loading,
    setLoading,
    handleChange,
  };
}
