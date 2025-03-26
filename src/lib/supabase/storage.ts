import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Upload file to Supabase Storage
export const uploadFile = async (
  userId: string,
  file: File,
  bucket = 'profiles',
  path = 'uploads'
): Promise<{ url: string; path: string }> => {
  try {
    // Create a unique file name
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}_${uuidv4()}.${fileExtension}`;
    const filePath = `${userId}/${path}/${fileName}`;
    
    console.log(`Uploading file to Supabase bucket: ${bucket}, path: ${filePath}`);
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }
    
    console.log('File uploaded successfully:', data);
    
    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return {
      url: publicUrl,
      path: data.path
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
  console.log('Uploading CV file for user:', userId);
  return uploadFile(userId, file, 'cv-files', 'documents');
};

// Upload CV image
export const uploadCVImage = async (
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
  
  console.log('Uploading CV image for user:', userId);
  return uploadFile(userId, file, 'cv-images', 'images');
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
  
  console.log('Uploading profile image for user:', userId);
  return uploadFile(userId, file, 'profiles', 'profile');
};
// Get file download URL
export const getFileURL = async (bucket: string, filePath: string): Promise<string> => {
  try {
    console.log(`Getting public URL for bucket: ${bucket}, path: ${filePath}`);
    const { data } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

// Delete file from storage
export const deleteFile = async (bucket: string, filePath: string): Promise<void> => {
  try {
    console.log(`Deleting file from bucket: ${bucket}, path: ${filePath}`);
    const { error } = await supabase
      .storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) {
      console.error('Storage delete error:', error);
      throw error;
    }
    
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// List all files in a directory
export const listFiles = async (
  userId: string,
  bucket = 'profiles',
  path = 'uploads'
): Promise<{ name: string; url: string; path: string }[]> => {
  try {
    const directoryPath = `${userId}/${path}`;
    console.log(`Listing files in bucket: ${bucket}, path: ${directoryPath}`);
    
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .list(directoryPath);
    
    if (error) {
      console.error('Storage list error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No files found in directory');
      return [];
    }
    
    console.log(`Found ${data.length} files in directory`);
    
    const files = await Promise.all(
      data.map(async (item) => {
        const filePath = `${directoryPath}/${item.name}`;
        const { data } = supabase
          .storage
          .from(bucket)
          .getPublicUrl(filePath);
        
        return {
          name: item.name,
          url: data.publicUrl,
          path: filePath
        };
      })
    );
    
    return files;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};