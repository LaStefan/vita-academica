/**
 * PDF utility functions for browser compatibility
 */

// Helper function to check if we're running in a browser environment
export function isBrowser() {
  return typeof window !== 'undefined';
}

// Setup function for PDF operations
export function setupPdfWorker() {
  if (isBrowser()) {
    console.log("PDF viewer setup complete for browser environment");
    return true;
  }
  return false;
}

// Get document URL for preview
export function getDocumentPreviewUrl(url: string): string {
  if (!url) return '';
  return url;
}

// Get estimated file size from URL (mock function)
export function getFileSizeFromUrl(url: string): string {
  // This is a mock function that would normally fetch the file size
  // In a real implementation, this would use HEAD requests or other methods
  return "~350 KB";
}

// Get estimated page count (mock function)
export function getPageCountEstimate(): number {
  // This is a mock function that would normally extract page count from the PDF
  // In a real implementation, this would use PDF.js or other PDF parsing libraries
  return Math.floor(Math.random() * 10) + 10; // Returns a random number between 10-19
}