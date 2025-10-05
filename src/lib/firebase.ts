// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
if (!apiKey) {
  throw new Error("Missing EXPO_PUBLIC_FIREBASE_API_KEY in environment");
}

const firebaseConfig = {
  apiKey,
  authDomain: "family-time-a2169.firebaseapp.com",
  projectId: "family-time-a2169",
  storageBucket: "family-time-a2169.firebasestorage.app",
  messagingSenderId: "264476201361",
  appId: "1:264476201361:web:a8f7f88b8b733e79fa4a30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);