/**
 * Firebase configuration for the RIZER WEB APP.
 * These values are safe to be public as security is enforced via Firestore Rules.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAkcqSQkusxP1X2K-ojbKIu_dQNX2sLkng",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "webnp-699dd.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "webnp-699dd",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "webnp-699dd.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "878573023998",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:878573023998:web:16ebeb9981f445e9d32baf",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};
