import { storage } from '@/lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { ParsedCV } from '@/types/parsed-cv';
import { generateMockCVData } from '@/lib/utils/mockCVData';
import { uploadCVFile } from '@/lib/firebase/storage';



// Document metadata type
export interface DocumentMetadata {
  fileName: string;
  fileSize?: string;
  fileType?: string;
  uploadDate?: string;
  lastModified?: string;
  url: string;
}

/**
 * Parses a document file (PDF, DOC, DOCX, TEX) into structured CV data.
 * In this MVP implementation, we upload the file to Firebase Storage 
 * and then return mock data for demonstration purposes.
 * 
 * @param file The document file to parse
 * @param userId The ID of the user who owns the document
 * @returns A promise that resolves to the parsed CV data
 */
export const parseDocument = async (file: File, userId: string = 'anonymous'): Promise<ParsedCV> => {
  try {
    console.log(`Starting to process document: ${file.name} for user: ${userId}`);
    
    // Step 1: Upload the file to Firebase Storage
    const uploadResult = await uploadCVFile(userId, file)
    console.log('File uploaded successfully to:', uploadResult.path);
    
    // Get the download URL
    console.log('File download URL:', uploadResult.url);
    
    // For the MVP, return mock data instead of actually parsing the document
    const mockData = generateMockCVData(userId, uploadResult.path, uploadResult.url);
    
    // Add the actual download URL
    mockData.cvFileUrl = uploadResult.url;
    mockData.cvFilePath = uploadResult.path;
    
    console.log('Generated mock CV data for demonstration');
    
    return mockData;
  } catch (error) {
    console.error("Error in parseDocument:", error);
    throw new Error(`Failed to process the document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Exports a CV to a specified format (PDF, Word, LaTeX)
 * This is a mock implementation for the MVP
 * 
 * @param cvData The CV data to export
 * @param format The format to export to (pdf, word, latex)
 * @param template The template to use for export
 * @returns A promise that resolves to the URL of the exported file
 */
export const exportCV = async (
  cvData: ParsedCV, 
  format: 'pdf' | 'word' | 'latex' = 'pdf',
  template: string = 'classic'
): Promise<string> => {
  try {
    console.log(`Exporting CV as ${format} using ${template} template`);
    
    // For the MVP, we'll just return a mock URL
    // In a real implementation, this would generate the actual file and return its URL
    const mockExportedFileUrl = `https://example.com/exports/${cvData.personalInfo?.name?.replace(/\s+/g, '-').toLowerCase() || 'cv'}-${template}-${Date.now()}.${format === 'word' ? 'docx' : format}`;
    
    console.log(`Mock export completed: ${mockExportedFileUrl}`);
    
    return mockExportedFileUrl;
  } catch (error) {
    console.error(`Error exporting CV as ${format}:`, error);
    throw new Error(`Failed to export CV: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Gets metadata about a document
 * 
 * @param fileUrl The URL of the document
 * @param fileName The name of the document
 * @returns Document metadata
 */
export const getDocumentMetadata = (fileUrl: string, fileName: string): DocumentMetadata => {
  // In a real implementation, this would fetch actual metadata from the file
  const now = new Date();
  
  return {
    fileName: fileName || 'CV Document',
    fileSize: '1.2 MB', // Mock file size
    fileType: fileUrl.split('.').pop()?.toUpperCase() || 'PDF',
    uploadDate: now.toLocaleDateString(),
    lastModified: now.toLocaleDateString(),
    url: fileUrl
  };
};
