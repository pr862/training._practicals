import { auth } from "../firebase/config";
import { assertRequiredString, assertRequiredValue } from "./validation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import type { User, UserCredential, Unsubscribe } from "firebase/auth";

export const registerUser = (email: string, password: string): Promise<UserCredential> => {
  const validatedEmail = assertRequiredString(email, "Email");
  const validatedPassword = assertRequiredString(password, "Password");

  return createUserWithEmailAndPassword(
    auth,
    validatedEmail,
    validatedPassword
  );
};

export const loginUser = (email: string, password: string): Promise<UserCredential> => {
  const validatedEmail = assertRequiredString(email, "Email");
  const validatedPassword = assertRequiredString(password, "Password");

  return signInWithEmailAndPassword(auth, validatedEmail, validatedPassword);
};

export const logoutUser = (): Promise<void> =>
  signOut(auth);

export const listenAuth = (callback: (user: User | null) => void): Unsubscribe => {
  const validatedCallback = assertRequiredValue(callback, "Auth callback");

  return onAuthStateChanged(auth, validatedCallback);
};

export const updateUserProfile = (
  user: User,
  profile: { displayName?: string; photoURL?: string | null }
): Promise<void> => {
  const validatedUser = assertRequiredValue(user, "User");
  const validatedProfile = assertRequiredValue(profile, "Profile");

  return updateProfile(validatedUser, validatedProfile);
};
