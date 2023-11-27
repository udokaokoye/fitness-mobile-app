// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithRedirect } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjLHQhpSlJgmyhQtzr2oCQrW9wB4yZmbA",
  authDomain: "fitness-3c482.firebaseapp.com",
  projectId: "fitness-3c482",
  storageBucket: "fitness-3c482.appspot.com",
  messagingSenderId: "464545559893",
  appId: "1:464545559893:web:354442053d29214e72ebdc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const provider = new GoogleAuthProvider();
export const auth = getAuth(app);



