
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
  apiKey: "YOUR_API_KEY", // Replace with actual API key in production
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
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
