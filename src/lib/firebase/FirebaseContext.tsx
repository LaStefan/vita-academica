
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from './firebase';
import { createUserDocument } from './auth';

interface FirebaseContextType {
  currentUser: User | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  currentUser: null,
  loading: true
});

export const useFirebase = () => useContext(FirebaseContext);

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use actual Firebase authentication
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Create or update user document in Firestore
        await createUserDocument(user);
      }
      
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};