import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp} from 'firebase/firestore';
import { auth, db } from '../config/firebase.js';

export interface UserProfile {
  email: string;
  displayName?: string;
  createdAt: Timestamp;
}

export type AuthCallback = (user: any) => Promise<void> | void;

export async function registerUser(email: string, password: string, displayName?: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  if (user) {
    const userProfile: UserProfile = {
      email: email.toLowerCase(),
      displayName: displayName || email.split('@')[0],
      createdAt: Timestamp.now()
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
  }
  
  console.log('User registered successfully:', user.uid);
  return user;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  console.log('User logged in successfully:', userCredential.user.uid);
  return userCredential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
  console.log('User logged out successfully');
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, 'users', userId));
  if (snapshot.exists()) {
    return snapshot.data() as UserProfile;
  }
  return null;
}

export function createAuthHandler(
  mainContent: HTMLElement | null,
  onAuthenticated: AuthCallback,
  onUnauthenticated?: () => void
): () => void {
  const handleUserAuth = async (user: any): Promise<void> => {
    if (user) {
      if (mainContent) {
        mainContent.classList.remove('hidden');
      }
      const profile = await getUserProfile(user.uid);
      const displayName = profile?.displayName || user.email?.split('@')[0] || 'User';
      await onAuthenticated({ ...user, displayName });
    } else {
      if (onUnauthenticated) {
        onUnauthenticated();
      }
      window.location.href = 'login.html';
    }
  };

  if (mainContent) {
    mainContent.classList.add('hidden');
  }

  return onAuthChange(async (user: any) => {
    await handleUserAuth(user);
  });
}

export async function setupLogout(logoutBtn: HTMLButtonElement): Promise<void> {
  logoutBtn.addEventListener('click', async () => {
    await logoutUser();
    window.location.href = 'login.html';
  });
}

export function getFirebaseAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/invalid-credential': 'Invalid email or password. Please check your credentials and try again.',
    'auth/user-not-found': 'No account found with this email. Please register first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later or reset your password.',
    'auth/email-already-in-use': 'This email is already registered. Please use a different email or login.',
    'auth/invalid-email': 'Invalid email format. Please enter a valid email address.',
    'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
    'auth/operation-not-allowed': 'Email/password registration is not enabled. Please contact support.',
    'auth/popup-closed-by-user': 'The login popup was closed. Please try again.',
    'auth/cancelled-popup-request': 'Login was cancelled. Please try again.',
    'auth/network-request-failed': 'Network error. Please check your connection and try again.',
    'auth/api-key-not-valid': 'Application configuration error. Please contact support.',
    'auth/app-deleted': 'Application has been deleted. Please contact support.',
    'auth/expired-action-code': 'This link has expired. Please request a new one.',
    'auth/invalid-action-code': 'This link is invalid. Please request a new one.',
  };
  
  return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

