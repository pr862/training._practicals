import { useCallback, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { updateUserProfile } from "../services/auth";
import { saveUser, updateUser } from "../services/user";
import { uploadImageToCloudinary } from "../services/upload";
import { validateName, validateProfileImage } from "../utils/validation";
import type { User } from "../types/user";

export function useCurrentUserProfile(currentUser: FirebaseUser | null, me?: User) {
  const [isProfileImageUploading, setIsProfileImageUploading] = useState(false);

  const updateCurrentUserPhoto = useCallback(async (file: File) => {
    if (!currentUser) return;
    const imageError = validateProfileImage(file);
    if (imageError) {
      throw new Error(imageError);
    }

    setIsProfileImageUploading(true);

    try {
      const photoURL = await uploadImageToCloudinary(file);
      const displayName = currentUser.displayName ?? me?.name ?? "";
      const email = currentUser.email ?? me?.email ?? "";

      await updateUserProfile(currentUser, {
        ...(displayName ? { displayName } : {}),
        photoURL,
      });

      await saveUser(currentUser.uid, email, displayName, photoURL);
    } finally {
      setIsProfileImageUploading(false);
    }
  }, [currentUser, me?.email, me?.name]);

  const updateCurrentUserProfile = useCallback(async (name: string, file?: File | null, removePhoto = false) => {
    if (!currentUser) return;

    const nameError = validateName(name);
    if (nameError) {
      throw new Error(nameError);
    }

    const imageError = validateProfileImage(file ?? null);
    if (imageError) {
      throw new Error(imageError);
    }

    setIsProfileImageUploading(true);

    try {
      const trimmedName = name.trim();
      const email = currentUser.email ?? me?.email ?? "";
      const photoURL = file
        ? await uploadImageToCloudinary(file)
        : removePhoto
          ? null
          : currentUser.photoURL ?? me?.photoURL ?? "";

      await updateUserProfile(currentUser, {
        displayName: trimmedName,
        photoURL,
      });

      await updateUser(currentUser.uid, {
        name: trimmedName,
        email,
        photoURL,
      });
    } finally {
      setIsProfileImageUploading(false);
    }
  }, [currentUser, me?.email, me?.photoURL]);

  return {
    isProfileImageUploading,
    updateCurrentUserPhoto,
    updateCurrentUserProfile,
  };
}
