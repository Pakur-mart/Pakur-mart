// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}


// Firebase configuration with environment variables
export const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyC1Q_rYvraiyqDzagicVV5Gn5CI43ggusg",
  authDomain: "pakur-mart.firebaseapp.com",
  projectId: "pakur-mart",
  storageBucket: "pakur-mart.firebasestorage.app",
  messagingSenderId: "156313586096",
  appId: "1:156313586096:web:bfc935ddd9a2f1b1a22e75",
  measurementId: "G-E8YQDDD78J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;


