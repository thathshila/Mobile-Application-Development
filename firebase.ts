
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8XdZraD5eQj-PqajGGpYqThmdhITTuLs",
  authDomain: "spendwise-75b66.firebaseapp.com",
  projectId: "spendwise-75b66",
  storageBucket: "spendwise-75b66.appspot.com", // fix small typo
  messagingSenderId: "690796736901",
  appId: "1:690796736901:web:ae28bdd05212a78b7ad4ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);

// Storage (for book covers if needed)
export const storage = getStorage(app);
