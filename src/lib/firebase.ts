import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all required Firebase config values are present
const allConfigPresent = Object.values(firebaseConfig).every(val => !!val);

let app;
if (allConfigPresent) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} else {
    console.error(`
      Firebase configuration is missing. 
      Please make sure you have a .env file with all the required NEXT_PUBLIC_FIREBASE_... variables.
      You can get these from your Firebase project's settings.
    `);
}

const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

export { app, auth, db };
