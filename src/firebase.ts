import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "smartstudy-b9775.firebaseapp.com",
  projectId: "smartstudy-b9775",
  storageBucket: "smartstudy-b9775.firebasestorage.app",
  messagingSenderId: "903801963321",
  appId: "1:903801963321:web:8c2b471b3f58807fb05ee8",
  measurementId: "G-9LZX29Y6W0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return user;
  } catch (error) {
    console.error("Error during Google sign-in: ", error);
    return null;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

export { auth, signInWithGoogle, logout };
