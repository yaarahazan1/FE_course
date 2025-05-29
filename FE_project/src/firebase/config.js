// firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDp90ELgV8p1FVAlRWEnB8ARj3MLAuJk8A",
  authDomain: "smart-student-1cf98.firebaseapp.com",
  projectId: "smart-student-1cf98",
  storageBucket: "smart-student-1cf98.firebasestorage.app",
  messagingSenderId: "987462851609",
  appId: "1:987462851609:web:6f2b7405077ff12ec25e88",
  measurementId: "G-S72MLRH622"
};

// הדפסה לוודא שההגדרות נטענות
console.log("Firebase Config loaded:", firebaseConfig);

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

// Initialize services
let auth, db, storage;

try {
  auth = getAuth(app);
  console.log("Firebase Auth initialized");
} catch (error) {
  console.error("Error initializing Auth:", error);
  throw error;
}

try {
  db = getFirestore(app);
  console.log("Firestore initialized");
} catch (error) {
  console.error("Error initializing Firestore:", error);
  throw error;
}

try {
  storage = getStorage(app);
  console.log("Firebase Storage initialized");
} catch (error) {
  console.error("Error initializing Storage:", error);
  throw error;
}

// Export services
export { auth, db, storage };
export default app;