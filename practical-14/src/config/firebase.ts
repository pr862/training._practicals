import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, setDoc, Timestamp, query, where, orderBy } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBb12xxONv3fBUmpM9rDWp8aOOq2aRFLZA",
  authDomain: "quizmaster-fa7c9.firebaseapp.com",
  projectId: "quizmaster-fa7c9",
  storageBucket: "quizmaster-fa7c9.firebasestorage.app",
  messagingSenderId: "236992747022",
  appId: "1:236992747022:web:277250eba66490fcc18e5f",
  measurementId: "G-BGEBKPLW5G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { collection, doc, addDoc, getDoc, getDocs, setDoc, Timestamp, query, where, orderBy };export default app

