
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase/firebase';
import { 
  signInWithEmail, 
  signInWithGoogle, 
  signUpWithEmail, 
  signOutUser,
  resetPassword 
} from '@/lib/firebase/auth';
import { User, UserCredential } from 'firebase/auth';

export const useFirebaseAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<UserCredential | null> => {
    try {
      setError(null);
      return await signInWithEmail(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      return null;
    }
  };

  const loginWithGoogle = async (): Promise<UserCredential | null> => {
    try {
      setError(null);
      return await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      return null;
    }
  };

  const signup = async (email: string, password: string, displayName: string): Promise<UserCredential | null> => {
    try {
      setError(null);
      return await signUpWithEmail(email, password, displayName);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setError(null);
      await signOutUser();
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
    }
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    try {
      setError(null);
      await resetPassword(email);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
    }
  };

  return {
    currentUser,
    loading,
    error,
    login,
    loginWithGoogle,
    signup,
    logout,
    sendPasswordReset
  };
};
