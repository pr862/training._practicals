import { db } from "../config";
import { deleteField, doc, setDoc, Timestamp } from "firebase/firestore";
import {
  assertAtLeastOneField,
  assertRequiredString,
  assertRequiredValue,
} from "../validation";

export const saveUser = async (
  uid: string,
  email: string,
  name?: string,
  photoURL?: string | null
) => {
  const validatedUid = assertRequiredString(uid, "User ID");
  const validatedEmail = assertRequiredString(email, "Email");
  const normalizedName = name?.trim() || "";
  const normalizedPhotoURL = photoURL?.trim() || "";

  const payload: Record<string, unknown> = {
    uid: validatedUid,
    email: validatedEmail,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  if (normalizedName) {
    payload.Name = normalizedName;
    payload.name = normalizedName;
  }

  if (normalizedPhotoURL) {
    payload.photoURL = normalizedPhotoURL;
  }

  return await setDoc(doc(db, "users", validatedUid), payload, { merge: true });
};

export const updateUser = async (
  uid: string,
  payload: { name?: string; email?: string; photoURL?: string | null }
) => {
  const validatedUid = assertRequiredString(uid, "User ID");
  const validatedPayload = assertRequiredValue(payload, "User update");
  assertAtLeastOneField(validatedPayload, "User update");

  const updates: Record<string, unknown> = {
    updatedAt: Timestamp.now(),
  };

  const normalizedName = validatedPayload.name === undefined ? undefined : assertRequiredString(validatedPayload.name, "Name");
  if (normalizedName !== undefined) {
    updates.name = normalizedName;
    updates.Name = normalizedName;
  }

  if (validatedPayload.email !== undefined) {
    updates.email = assertRequiredString(validatedPayload.email, "Email");
  }

  if (validatedPayload.photoURL !== undefined) {
    const normalizedPhotoURL = validatedPayload.photoURL?.trim() ?? "";
    updates.photoURL = normalizedPhotoURL || deleteField();
  }

  updates.uid = validatedUid;

  return setDoc(doc(db, "users", validatedUid), updates, { merge: true });
};
