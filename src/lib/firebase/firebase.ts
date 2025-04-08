
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { firebaseConfig } from './config';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firebase Functions and get a reference to the service
export const functions = getFunctions(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// // Initialize Cloud Functions and get a reference to the service
// export const functions = getFunctions(app);

// Connect to emulators if in development environment
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8085);
  connectStorageEmulator(storage, 'localhost', 9199);
  // connectFunctionsEmulator(functions, 'localhost', 5001);

  console.log('Using Firebase services in emulation mode');
}
// Optional: Track auth state for logging/debugging
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     console.log('User is authenticated, Supabase operations should work');
//   } else {
//     console.log('No user logged in, Supabase operations will use anonymous access');
//   }
// })