import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "AIzaSyCKI1nY8CgyXfz27WF8OqJl2IGiNDkMpfU",
    authDomain: "ticketbot-11b47.firebaseapp.com",
    projectId: "ticketbot-11b47",
    storageBucket: "ticketbot-11b47.appspot.com",
    messagingSenderId: "251636267460",
    appId: "1:251636267460:web:0d672c254583dee965cc91"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);