import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBeoNBL219-NnPDpmFbWkedUDWGPHZ_K6I",
  authDomain: "applyify-1c3a6.firebaseapp.com",
  projectId: "applyify-1c3a6",
  storageBucket: "applyify-1c3a6.firebasestorage.app",
  messagingSenderId: "179615616515",
  appId: "1:179615616515:web:6894accb29078b94950836",
  measurementId: "G-CP8PRRE98L",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
