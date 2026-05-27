// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTPBl6x8krOUbHEKNnaUZIdxPaanuInwE",
  authDomain: "icecream-app-5e7ee.firebaseapp.com",
  projectId: "icecream-app-5e7ee",
  storageBucket: "icecream-app-5e7ee.firebasestorage.app",
  messagingSenderId: "909773375518",
  appId: "1:909773375518:web:27b5505c3b7d23c29fc60f",
  measurementId: "G-R46GXDNWV0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);