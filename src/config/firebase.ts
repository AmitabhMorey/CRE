import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD40Pjxyh82x-nYBya5iboTu9BG-kEsb58",
  authDomain: "cr-e-556e5.firebaseapp.com",
  databaseURL: "https://cr-e-556e5-default-rtdb.firebaseio.com",
  projectId: "cr-e-556e5",
  storageBucket: "cr-e-556e5.firebasestorage.app",
  messagingSenderId: "314484950871",
  appId: "1:314484950871:web:273bc393b7b04d33506012",
  measurementId: "G-Q9SQFKCGBH"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, analytics, auth, database };
