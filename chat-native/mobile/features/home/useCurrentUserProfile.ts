import { useCallback, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { updateUserProfile } from "../../../packages/data/auth/service";
import { saveUser, updateUser } from "../../../packages/data/user/service";
import { uploadImageToCloudinary, type UploadImageSource } from "../../../packages/data/upload/service";
import { validateName, validateProfileImage } from "../auth/validation";
import type { User } from "../../../packages/data/user/model";

const getValidatableImage = (file: UploadImageSource | null) => (
  typeof file === "string" ? null : file
);

export function useCurrentUserProfile(currentUser: FirebaseUser | null, me?: User) {
  const [isProfileImageUploading, setIsProfileImageUploading] = useState(false);

  const updateCurrentUserPhoto = useCallback(async (file: UploadImageSource) => {
    if (!currentUser) return;
    const imageError = validateProfileImage(getValidatableImage(file));
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

  const updateCurrentUserProfile = useCallback(async (name: string, file?: UploadImageSource | null, removePhoto = false) => {
    if (!currentUser) return;

    const nameError = validateName(name);
    if (nameError) {
      throw new Error(nameError);
    }

    const imageError = validateProfileImage(getValidatableImage(file ?? null));
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
