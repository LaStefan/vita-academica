
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  UploadResult
} from 'firebase/storage';
import { storage } from './firebase';

// Upload file to Firebase Storage
export const uploadFile = async (
  userId: string, 
  file: File, 
  path = 'uploads'
): Promise<{ url: string; path: string }> => {
  try {
    // Create a unique file name
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `users/${userId}/${path}/${fileName}`;
    const storageRef = ref(storage, filePath);
    
    // Upload file
    const uploadResult: UploadResult = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    return {
      url: downloadURL,
      path: filePath
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Upload CV file
export const uploadCVFile = async (
  userId: string, 
  file: File
): Promise<{ url: string; path: string }> => {
  return uploadFile(userId, file, 'cvs');
};

// Upload profile image
export const uploadProfileImage = async (
  userId: string, 
  file: File
): Promise<{ url: string; path: string }> => {
  // Validate file type
  const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!validImageTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG or PNG image.');
  }
  
  // Limit file size to 5MB
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSizeInBytes) {
    throw new Error('File too large. Maximum size is 5MB.');
  }
  
  return uploadFile(userId, file, 'profile');
};

// Get file download URL
export const getFileURL = async (filePath: string): Promise<string> => {
  try {
    const storageRef = ref(storage, filePath);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

// Delete file from storage
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// List all files in a directory
export const listFiles = async (
  userId: string, 
  path = 'uploads'
): Promise<{ name: string; url: string; path: string }[]> => {
  try {
    const directoryPath = `users/${userId}/${path}`;
    const directoryRef = ref(storage, directoryPath);
    const listResult = await listAll(directoryRef);
    
    const files = await Promise.all(
      listResult.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          url,
          path: itemRef.fullPath
        };
      })
    );
    
    return files;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};
