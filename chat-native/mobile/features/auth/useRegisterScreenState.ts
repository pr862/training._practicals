import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  registerUser,
  updateUserProfile,
} from "../../../packages/data/auth/service";
import { saveUser } from "../../../packages/data/user/service";
import { uploadImageToCloudinary } from "../../../packages/data/upload/service";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "./validation";
import { useAuthForm } from "./useAuthForm";

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function useRegisterScreenState() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const form = useAuthForm<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permissions to upload a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    const newErrors: Partial<Record<keyof RegisterFormValues, string>> = {
      name: validateName(form.values.name) || "",
      email: validateEmail(form.values.email) || "",
      password: validatePassword(form.values.password) || "",
      confirmPassword:
        validateConfirmPassword(
          form.values.confirmPassword,
          form.values.password
        ) || "",
    };

    if (Object.values(newErrors).some((err) => err !== "")) {
      form.setErrors(newErrors);
      return;
    }

    try {
      form.setLoading(true);
      const res = await registerUser(form.values.email, form.values.password);

      let photoURL = "";
      if (profileImage) {
        photoURL = await uploadImageToCloudinary(profileImage);
      }

      await updateUserProfile(res.user, {
        displayName: form.values.name,
        ...(photoURL ? { photoURL } : {}),
      });

      await saveUser(
        res.user.uid,
        res.user.email!,
        form.values.name,
        photoURL
      );
    } catch (err) {
      const errorCode =
        err && typeof err === "object" && "code" in err
          ? String((err as { code?: unknown }).code ?? "")
          : "";

      if (errorCode === "auth/email-already-in-use") {
        form.setErrors((prev) => ({
          ...prev,
          email: "Email already exists.",
        }));
        return;
      }

      Alert.alert(
        "Registration Failed",
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      form.setLoading(false);
    }
  };

  return {
    ...form,
    profileImage,
    pickImage,
    handleRegister,
  };
}

