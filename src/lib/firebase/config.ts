
/**
 * Firebase Configuration
 * 
 * This file contains the Firebase configuration settings for the application.
 * In a production environment, these values should be replaced with your actual Firebase project details.
 * 
 * For development, you can use these placeholder values - the app will run in "development mode"
 * where authentication is bypassed.
 * 
 * @important When deploying to production, replace these values with actual Firebase project configuration.
 */

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};