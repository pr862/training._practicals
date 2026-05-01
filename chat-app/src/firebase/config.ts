import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBu1e3LD3RnvkTvm-v5ozt4CeHgi1XxRPQ",
  authDomain: "://firebaseapp.com",
  projectId: "chat-app-4e8f0",
  storageBucket: "chat-app-4e8f0.firebasestorage.app",
  messagingSenderId: "744922274380",
  appId: "1:744922274380:web:f97bedd3f97d9f0b32f2e9",
  measurementId: "G-309TS2GKM1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
