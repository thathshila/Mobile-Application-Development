
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyC8XdZraD5eQj-PqajGGpYqThmdhITTuLs",
  authDomain: "spendwise-75b66.firebaseapp.com",
  projectId: "spendwise-75b66",
  storageBucket: "spendwise-75b66.appspot.com", 
  messagingSenderId: "690796736901",
  appId: "1:690796736901:web:ae28bdd05212a78b7ad4ec"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);


export const storage = getStorage(app);
