// Firebase configuration for web
import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBIvTUeN-I9FnCgz7d0ybhdWRpwsyFH0_s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fg-react-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fg-react-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fg-react-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "489135632905",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:489135632905:web:20779662c09acf532a3ed8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-TSS2FD4QBJ",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// Configure providers
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

appleProvider.addScope('email');
appleProvider.addScope('name');

export { app };
