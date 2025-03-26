
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp, 
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import { ActivityItem } from '@/types/activity';
import { ParsedCV } from '@/types/parsed-cv';

// User profiles collection
export const userProfilesCollection = collection(db, 'userProfiles');

// CVs collection
export const cvsCollection = collection(db, 'cvs');

// Activities collection
export const activitiesCollection = collection(db, 'activities');

// Add or update CV
export const saveCV = async (userId: string, cvData: ParsedCV, cvId?: string): Promise<string> => {
  try {
    const userCvsCollection = collection(db, 'users', userId, 'cvs');
    
    if (cvId) {
      // Update existing CV
      const cvRef = doc(userCvsCollection, cvId);
      await updateDoc(cvRef, {
        ...cvData,
        updatedAt: serverTimestamp()
      });
      return cvId;
    } else {
      // Create new CV
      const newCvRef = doc(userCvsCollection);
      await setDoc(newCvRef, {
        ...cvData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return newCvRef.id;
    }
  } catch (error) {
    console.error('Error saving CV:', error);
    throw error;
  }
};

// Get user CVs
export const getUserCVs = async (userId: string): Promise<DocumentData[]> => {
  try {
    const userCvsCollection = collection(db, 'users', userId, 'cvs');
    const q = query(userCvsCollection, orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user CVs:', error);
    throw error;
  }
};

// Delete CV
export const deleteCV = async (userId: string, cvId: string): Promise<void> => {
  try {
    const cvRef = doc(db, 'users', userId, 'cvs', cvId);
    await deleteDoc(cvRef);
  } catch (error) {
    console.error('Error deleting CV:', error);
    throw error;
  }
};

// Save user profile
export const saveUserProfile = async (userId: string, profileData: any): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      profile: profileData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId: string): Promise<DocumentData | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Save website settings
export const saveWebsiteSettings = async (userId: string, settings: any): Promise<void> => {
  try {
    const websiteRef = doc(db, 'users', userId, 'websites', 'main');
    await setDoc(websiteRef, {
      ...settings,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving website settings:', error);
    throw error;
  }
};

// Get website settings
export const getWebsiteSettings = async (userId: string): Promise<DocumentData | null> => {
  try {
    const websiteRef = doc(db, 'users', userId, 'websites', 'main');
    const websiteDoc = await getDoc(websiteRef);
    
    if (websiteDoc.exists()) {
      return websiteDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting website settings:', error);
    throw error;
  }
};

// Log user activity
export const logActivity = async (
  userId: string, 
  activity: Omit<ActivityItem, 'id' | 'date'> & { filePath?: string }
): Promise<string> => {
  try {
    const userActivitiesCollection = collection(db, 'users', userId, 'activities');
    const newActivityRef = doc(userActivitiesCollection);
    
    await setDoc(newActivityRef, {
      ...activity,
      timestamp: serverTimestamp()
    });
    
    return newActivityRef.id;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};

// Get user activities
export const getUserActivities = async (userId: string): Promise<ActivityItem[]> => {
  try {
    const userActivitiesCollection = collection(db, 'users', userId, 'activities');
    const q = query(userActivitiesCollection, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: Number(doc.id), // Convert to number for compatibility with existing code
        type: data.type,
        title: data.title,
        description: data.description,
        date: data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : '',
        icon: null, // Icons will be added in the UI component
        ...(data.filePath && { filePath: data.filePath })
      };
    });
  } catch (error) {
    console.error('Error getting user activities:', error);
    throw error;
  }
};
