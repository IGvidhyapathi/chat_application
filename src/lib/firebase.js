import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-chat-application-3421b.firebaseapp.com",
  projectId: "react-chat-application-3421b",
  storageBucket: "react-chat-application-3421b.appspot.com",
  messagingSenderId: "1024713756819",
  appId: "1:1024713756819:web:539ea08acba44ae8a9fd66"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()