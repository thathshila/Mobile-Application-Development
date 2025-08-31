// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8XdZraD5eQj-PqajGGpYqThmdhITTuLs",
  authDomain: "spendwise-75b66.firebaseapp.com",
  projectId: "spendwise-75b66",
  storageBucket: "spendwise-75b66.firebasestorage.app",
  messagingSenderId: "690796736901",
  appId: "1:690796736901:web:ae28bdd05212a78b7ad4ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);