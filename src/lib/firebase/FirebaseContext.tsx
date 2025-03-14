
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from './firebase';
import { createUserDocument, getCurrentUser } from './auth';
import { isDevMode } from './config';
import { logDevModeWarning } from '../utils/devModeUtils';

interface FirebaseContextType {
  currentUser: User | null;
  loading: boolean;
  isDevMode: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  currentUser: null,
  loading: true,
  isDevMode: false
});

export const useFirebase = () => useContext(FirebaseContext);

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const devMode = isDevMode();

  useEffect(() => {
    if (devMode) {
      // In development mode, set a mock user and skip Firebase authentication
      logDevModeWarning('Firebase services');
      const mockUser = getCurrentUser();
      setCurrentUser(mockUser);
      setLoading(false);
      return () => {}; // No cleanup needed for mock user
    }
    
    // In production mode, use actual Firebase authentication
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Create or update user document in Firestore
        await createUserDocument(user);
      }
      
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [devMode]);

  const value = {
    currentUser,
    loading,
    isDevMode: devMode
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
