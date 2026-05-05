import { db } from "../firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

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
