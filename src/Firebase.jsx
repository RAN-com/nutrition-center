import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBb7HihkPwkG8vNgZh5oSsFAzev1ICnA2M",
    authDomain: "nutrition-7b61a.firebaseapp.com",
    projectId: "nutrition-7b61a",
    storageBucket: "nutrition-7b61a.firebasestorage.app",
    messagingSenderId: "913564196178",
    appId: "1:913564196178:web:a35adb9f64a0adf88eae8b",
    measurementId: "G-R19DG2ECGQ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);

export { db,auth };
