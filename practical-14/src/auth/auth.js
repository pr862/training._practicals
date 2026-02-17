import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase.js';
export async function registerUser(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (user) {
        const userProfile = {
            email: email.toLowerCase(),
            displayName: displayName || email.split('@')[0],
            createdAt: Timestamp.now()
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);
    }
    return user;
}
export async function loginUser(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}
export async function logoutUser() {
    await signOut(auth);
}
export function getCurrentUser() {
    return auth.currentUser;
}
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}
export async function getUserProfile(userId) {
    const snapshot = await getDoc(doc(db, 'users', userId));
    if (snapshot.exists()) {
        return snapshot.data();
    }
    return null;
}
export function createAuthHandler(mainContent, onAuthenticated, onUnauthenticated) {
    const handleUserAuth = async (user) => {
        if (user) {
            if (mainContent) {
                mainContent.classList.remove('hidden');
            }
            const profile = await getUserProfile(user.uid);
            const displayName = profile?.displayName || user.email?.split('@')[0] || 'User';
            await onAuthenticated({ ...user, displayName });
        }
        else {
            if (onUnauthenticated) {
                onUnauthenticated();
            }
            window.location.href = 'login.html';
        }
    };
    if (mainContent) {
        mainContent.classList.add('hidden');
    }
    return onAuthChange(async (user) => {
        await handleUserAuth(user);
    });
}
export async function setupLogout(logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await logoutUser();
        window.location.href = 'login.html';
    });
}
export function getFirebaseAuthErrorMessage(errorCode) {
    const errorMessages = {
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
