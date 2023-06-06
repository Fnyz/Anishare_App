
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBEyNgkFWlYfMkHQLDxFt48l4jGCgwgc2o",
    authDomain: "anishare-9a29e.firebaseapp.com",
    projectId: "anishare-9a29e",
    storageBucket: "anishare-9a29e.appspot.com",
    messagingSenderId: "81575056628",
    appId: "1:81575056628:web:78962710b22890a64e3aa1"
  };


const app = initializeApp(firebaseConfig);

export const Auth = getAuth(app);
export const db = getFirestore(app)



