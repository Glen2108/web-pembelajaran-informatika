import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCTD-3NLDHGCucMSWHAosSHu2-e6znnLm8",
  authDomain: "informatika-sman4-manado.firebaseapp.com",
  projectId: "informatika-sman4-manado",
  storageBucket: "informatika-sman4-manado.firebasestorage.app",
  messagingSenderId: "781063295262",
  appId: "1:781063295262:web:2678cf21a195ba2497b90f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);