import { db } from "../firebase/config";
import { deleteField, doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";

export const saveUser = async (
  uid: string,
  email: string,
  name?: string,
  photoURL?: string | null
) => {
  const normalizedName = name?.trim() || "";
  const normalizedPhotoURL = photoURL?.trim() || "";

  const payload: Record<string, unknown> = {
    uid,
    email,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (normalizedName) {
    payload.Name = normalizedName;
    payload.name = normalizedName;
  }

  if (normalizedPhotoURL) {
    payload.photoURL = normalizedPhotoURL;
  }

  return await setDoc(doc(db, "users", uid), payload, { merge: true });
};

export const updateUser = async (
  uid: string,
  payload: { name?: string; email?: string; photoURL?: string | null }
) => {
  const updates: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  const normalizedName = payload.name?.trim();
  if (normalizedName !== undefined) {
    updates.name = normalizedName;
    updates.Name = normalizedName;
  }

  if (payload.email !== undefined) {
    updates.email = payload.email;
  }

  if (payload.photoURL !== undefined) {
    const normalizedPhotoURL = payload.photoURL?.trim() ?? "";
    updates.photoURL = normalizedPhotoURL || deleteField();
  }

  return updateDoc(doc(db, "users", uid), updates);
};
