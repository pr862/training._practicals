import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import type { User } from "../../../../packages/data/user/model";
import { validateName } from "../../auth/validation";

interface UseProfileEditStateProps {
  open: boolean;
  user?: User;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (name: string, imageUri?: string | null, removePhoto?: boolean) => Promise<void>;
}

export function useProfileEditState({
  open,
  user,
  isSubmitting,
  onCancel,
  onSubmit,
}: UseProfileEditStateProps) {
  const [name, setName] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && open) {
      setName(user.name || "");
      setImageUri(null);
      setRemovePhoto(false);
      setError("");
    }
  }, [user, open]);

  const handlePickImage = async () => {
    if (isSubmitting) return;
    setError("");

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setError("Permission to access the camera roll is required.");
      Alert.alert("Permission Denied", "Please allow gallery permissions in your system settings.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return;

    setImageUri(result.assets[0].uri);
    setRemovePhoto(false);
  };

  const handleRemovePhoto = () => {
    setImageUri(null);
    setRemovePhoto(true);
    setError("");
  };

  const handleNativeSubmit = async () => {
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const nameError = validateName(trimmedName);
    if (nameError) {
      setError(nameError);
      return;
    }

    try {
      setError("");
      await onSubmit(trimmedName, imageUri, removePhoto);
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    }
  };

  return {
    name,
    setName,
    imageUri,
    removePhoto,
    error,
    handlePickImage,
    handleRemovePhoto,
    handleNativeSubmit,
  };
}
