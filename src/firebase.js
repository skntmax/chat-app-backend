// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging/sw";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey : "AIzaSyCxRmzLAl1BcqwemxsdOWJo0rtJLnOiDY0",
  authDomain: "react-chatapp-d1639.firebaseapp.com",
  projectId: "react-chatapp-d1639",
  storageBucket: "react-chatapp-d1639.appspot.com",
  messagingSenderId: "68250438401",
  appId: "1:68250438401:web:03a2ea77a9543e28572900",
  measurementId: "G-351T4SXT6Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);