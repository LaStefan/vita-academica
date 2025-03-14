
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  UserCredential
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { isDevMode } from './config';
import { 
  simulateAsyncOperation, 
  getMockUserId, 
  logDevModeWarning, 
  getMockUser, 
  getMockUserCredential 
} from '../utils/devModeUtils';

// Sign up with email and password
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<UserCredential> => {
  if (isDevMode()) {
    logDevModeWarning('authentication');
    return simulateAsyncOperation(getMockUserCredential());
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName });
    }
    
    // Create user document in Firestore
    await createUserDocument(userCredential.user, { displayName });
    
    return userCredential;
  } catch (error) {
    console.error('Error signing up with email and password:', error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  if (isDevMode()) {
    logDevModeWarning('authentication');
    return simulateAsyncOperation(getMockUserCredential());
  }
  
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in with email and password:', error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  if (isDevMode()) {
    logDevModeWarning('authentication');
    return simulateAsyncOperation(getMockUserCredential());
  }
  
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user document exists, if not create it
    await createUserDocument(userCredential.user);
    
    return userCredential;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  if (isDevMode()) {
    logDevModeWarning('authentication');
    return simulateAsyncOperation(undefined);
  }
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  if (isDevMode()) {
    logDevModeWarning('password reset');
    return simulateAsyncOperation(undefined);
  }
  
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Create user document in Firestore
export const createUserDocument = async (
  user: User, 
  additionalData: { displayName?: string } = {}
): Promise<void> => {
  if (!user) return;
  
  if (isDevMode()) {
    logDevModeWarning('user document creation');
    return simulateAsyncOperation(undefined);
  }
  
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);
  
  // Create user document if it doesn't exist
  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    
    try {
      await setDoc(userRef, {
        email,
        displayName: displayName || additionalData.displayName || '',
        photoURL: photoURL || '',
        createdAt: serverTimestamp(),
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }
};

// Get current authenticated user
export const getCurrentUser = (): User | null => {
  if (isDevMode()) {
    // In development mode, always return the mock user
    return getMockUser();
  }
  
  return auth.currentUser;
};
