
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

export const firebaseConfig = {
  apiKey: "AIzaSyB1weLDpe68xkfWoDcUjmfn64-BS_3K0U8",
  authDomain: "testing-vita-academica.firebaseapp.com",
  projectId: "testing-vita-academica",
  storageBucket: "testing-vita-academica.firebasestorage.app",
  messagingSenderId: "914013505462",
  appId: "1:914013505462:web:56e728053d4f2eaafba317",
  measurementId: "G-SG928R98BL"
};

/**
 * Development Mode Detection
 * 
 * This function checks if the app is running with placeholder Firebase configuration values,
 * which indicates it's in development mode. This helps determine whether to use real
 * Firebase services or bypass them.
 */
export const isDevMode = (): boolean => {
  return (
    firebaseConfig.apiKey === "YOUR_API_KEY" ||
    !firebaseConfig.apiKey ||
    firebaseConfig.apiKey.includes("YOUR_")
  );
};
