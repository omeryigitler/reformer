import { getApp, getApps, initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyBG2Br1O8PkgKg4ofeXbdqSO0OxkbHMxao",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "reformer-pilates-malta.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "reformer-pilates-malta",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "reformer-pilates-malta.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "229596924816",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:229596924816:web:7861587fac11fc59188115",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, "europe-west1");

void setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Firebase auth persistence could not be enabled:", error);
});
