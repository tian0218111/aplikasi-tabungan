// src/firebase/firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi layanan Firestore dan Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, collection, getDocs, doc, addDoc, updateDoc, deleteDoc };
