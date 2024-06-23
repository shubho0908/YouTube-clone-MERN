import { initializeApp } from "firebase/app";
import { getStorage} from 'firebase/storage';
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9NomQPgAoQ6B1c64XhN3ahqN0U1Fe3YU",
  authDomain: "mern-df125.firebaseapp.com",
  projectId: "mern-df125",
  storageBucket: "mern-df125.appspot.com",
  messagingSenderId: "757150184874",
  appId: "1:757150184874:web:16b30a921277ea328527d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)
export const db = getFirestore(app)


