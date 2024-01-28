// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain:import.meta.VITE_FIREBASE_AUTH_DOMAIN,
//   databaseURL: import.meta.VITE_FIREBASE_DATABASE_URL,
//   projectId: import.meta.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId:import.meta.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.VITE_FIREBASE_MEASUREMENT_ID,
// };
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: "my-web-site-385808.firebaseapp.com",
//   databaseURL: import.meta.VITE_FIREBASE_DATABASE_URL,
//   projectId: import.meta.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.VITE_FIREBASE_MEASUREMENT_ID,
// };
const firebaseConfig = {
  apiKey: "AIzaSyB9W0_wxh7tUDHEvFULuxGeBErzfAPwM8w",
  authDomain: "my-web-site-385808.firebaseapp.com",
  databaseURL: "https://my-web-site-385808-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-web-site-385808",
  storageBucket: "my-web-site-385808.appspot.com",
  messagingSenderId: "503438361782",
  appId: "1:503438361782:web:235f222f9624d95783d217",
  measurementId: "G-0WV0EZY57Z"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const messaging = getMessaging(app);