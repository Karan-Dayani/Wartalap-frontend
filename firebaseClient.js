import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
  authDomain: "wartalaap-84843.firebaseapp.com",
  projectId: "wartalaap-84843",
  storageBucket: "wartalaap-84843.appspot.com",
  messagingSenderId: "489904366953",
  appId: "1:489904366953:web:d1391a16d4deff949289f8",
  measurementId: "G-X866QBXJY8",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const storage = firebase.storage();
export { storage };
