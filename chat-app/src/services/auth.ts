import { auth } from "../firebase/config";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile
} from "firebase/auth";
import type { User, UserCredential, Unsubscribe } from "firebase/auth";

export const registerUser = (email: string, password: string): Promise<UserCredential> => 
  createUserWithEmailAndPassword(auth, email, password);

export const loginUser = (email: string, password: string): Promise<UserCredential> => 
  signInWithEmailAndPassword(auth, email, password);

export const logoutUser = (): Promise<void> => 
  signOut(auth);

export const listenAuth = (callback: (user: User | null) => void): Unsubscribe => 
  onAuthStateChanged(auth, callback);

export const updateUserProfile = (
  user: User,
  profile: { displayName?: string; photoURL?: string | null }
): Promise<void> => updateProfile(user, profile);
