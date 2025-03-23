
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  updatePassword as firebaseUpdatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  UserCredential,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';

import { auth, db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

// Sign up with email and password
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<UserCredential> => {
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
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in with email and password:', error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
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
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Update user password
export const updatePassword = async (
  user: User, 
  currentPassword: string, 
  newPassword: string
): Promise<void> => {
  try {
    // Re-authenticate user before updating password
    if (!user.email) throw new Error('User email not found');
    
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await firebaseUpdatePassword(user, newPassword);
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  user: User,
  profileData: { displayName?: string; photoURL?: string; [key: string]: any }
): Promise<void> => {
  try {
    // Update Firebase Auth profile if display name or photo URL is provided
    if (profileData.displayName || profileData.photoURL) {
      const authUpdate: { displayName?: string; photoURL?: string } = {};
      if (profileData.displayName) authUpdate.displayName = profileData.displayName;
      if (profileData.photoURL) authUpdate.photoURL = profileData.photoURL;
      
      await updateProfile(user, authUpdate);
    }
    
    // Update user document in Firestore
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Create user document in Firestore
export const createUserDocument = async (
  user: User, 
  additionalData: { displayName?: string } = {}
): Promise<void> => {
  if (!user) return;
  
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
  return auth.currentUser;
};