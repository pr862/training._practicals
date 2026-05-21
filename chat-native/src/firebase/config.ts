import { initializeApp, FirebaseApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBu1e3LD3RnvkTvm-v5ozt4CeHgi1XxRPQ",
  authDomain: "://firebaseapp.com",
  projectId: "chat-app-4e8f0",
  storageBucket: "://appspot.com",
  messagingSenderId: "744922274380",
  appId: "1:744922274380:web:f97bedd3f97d9f0b32f2e9",
  measurementId: "G-309TS2GKM1"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
export const db: Firestore = getFirestore(app);

export default app;