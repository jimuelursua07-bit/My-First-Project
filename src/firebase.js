import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDU07jd3-zbwoNbQqoPh01NweUe5pEG1Lk",
  authDomain: "library-react-bd7a6.firebaseapp.com",
  projectId: "library-react-bd7a6",
  storageBucket: "library-react-bd7a6.firebasestorage.app",
  messagingSenderId: "1010056660397",
  appId: "1:1010056660397:web:e64b8c4f24c78159dc4d24",
  measurementId: "G-0BPWHDKZNV",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

