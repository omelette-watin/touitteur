// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5Rj3HxeSfJSBu-e5DBdvbWcCENiP0k78",
  authDomain: "touitteur-a3ce5.firebaseapp.com",
  projectId: "touitteur-a3ce5",
  storageBucket: "touitteur-a3ce5.appspot.com",
  messagingSenderId: "155300377584",
  appId: "1:155300377584:web:a86a3d51556551189ce335",
  measurementId: "G-0H0JTKJ2F6",
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
