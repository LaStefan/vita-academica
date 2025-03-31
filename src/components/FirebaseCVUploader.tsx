import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { parseDocument } from '@/services/documentParser';
import { toast } from 'sonner';
import { useFirebase } from '@/lib/firebase/FirebaseContext';
import { logActivity, saveCV } from '@/lib/firebase/firestore';
import { Document, Page } from 'react-pdf';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ParsedCV } from '@/types/parsed-cv';

type ParserStatus =
  | 'idle'
  | 'uploading'
  | 'parsing'
  | 'saving'
  | 'success'
  | 'error';

export const FirebaseCVUploader = ({
  onParsed,
  onFileSelected,
}: {
  onParsed?: (data: ParsedCV & { id?: string }) => void;
  onFileSelected?: (file: File) => void;
}) => {
  const [parsedData, setParsedData] = useState<ParsedCV | null>(null);
  const [status, setStatus] = useState<ParserStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const { currentUser } = useFirebase();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    if (!currentUser) {
      toast.error('You must be logged in to upload a CV');
      return;
    }

    if (onFileSelected) {
      onFileSelected(file);
    }

    try {
      console.log('Processing file:', file.name, 'size:', file.size);
      setStatus('uploading');
      setErrorMessage(null);
      toast.info('Processing document...');

      // Validate file size
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File is too large. Maximum file size is 10MB.');
      }

      // Validate file type
      const fileType = file.name.split('.').pop()?.toLowerCase();
      if (!['pdf', 'doc', 'docx', 'tex'].includes(fileType || '')) {
        throw new Error(
          'Unsupported file format. Please upload a PDF, Word, or LaTeX document.'
        );
      }

      // If it's a PDF, create a URL for previewing
      if (fileType === 'pdf') {
        const fileUrl = URL.createObjectURL(file);
        setPdfUrl(fileUrl);
        console.log('Created PDF preview URL');
      } else {
        setPdfUrl(null);
      }

      console.log('Starting to process CV file for user:', currentUser.uid);

      // Process the document with our parser
      setStatus('parsing');

      // Add timeout to ensure UI updates before heavy processing begins
      setTimeout(async () => {
        try {
          const data = await parseDocument(file, currentUser.uid);
          console.log('Document parsed successfully', data);
          setParsedData(data);

          // Save the CV data to Firestore automatically
          setStatus('saving');
          console.log('Auto-saving CV data to Firestore');

          try {
            const savedCvId = await saveCV(currentUser.uid, data);
            console.log('CV saved with ID:', savedCvId);

            // Log activity for the CV upload - Fixed activity type here from "cv_upload" to "upload"
            await logActivity(currentUser.uid, {
              type: 'upload',
              title: 'CV Uploaded',
              description: `Uploaded and parsed ${file.name}`,
              filePath: data.cvFilePath,
            });

            // Update data with the ID for reference
            const dataWithId = { ...data, id: savedCvId };
            setParsedData(dataWithId);

            setStatus('success');

            // Call the callback if provided
            if (onParsed) {
              onParsed(dataWithId);
            }

            // Display helpful message to the user
            toast.success('CV uploaded and saved successfully!', {
              description:
                'You can now edit and customize your CV in the editor.',
            });
          } catch (saveError: any) {
            console.error('Error saving CV to Firestore:', saveError);
            toast.error(
              "Document processed but couldn't be saved to your profile",
              {
                description: saveError.message || 'Please try saving manually.',
              }
            );

            // Still consider it a success for parsed data
            setStatus('success');

            // Call the callback with just the parsed data
            if (onParsed) {
              onParsed(data);
            }
          }
        } catch (error: any) {
          console.error('Error in document parsing:', error);
          setStatus('error');
          setErrorMessage(error.message || 'Failed to process document');
          toast.error(error.message || 'Failed to process document');
        }
      }, 100);
    } catch (error: any) {
      console.error('Error processing file:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to process document');
      toast.error(error.message || 'Failed to process document');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const renderStatusIndicator = () => {
    switch (status) {
      case 'uploading':
        return (
          <div className='flex items-center gap-2 text-yellow-600'>
            <Loader2 className='h-4 w-4 animate-spin' />
            <span>Uploading to secure storage...</span>
          </div>
        );
      case 'parsing':
        return (
          <div className='flex items-center gap-2 text-yellow-600'>
            <Loader2 className='h-4 w-4 animate-spin' />
            <span>Processing document...</span>
          </div>
        );
      case 'saving':
        return (
          <div className='flex items-center gap-2 text-yellow-600'>
            <Loader2 className='h-4 w-4 animate-spin' />
            <span>Saving to your profile...</span>
          </div>
        );
      case 'success':
        return (
          <div className='flex items-center gap-2 text-green-600'>
            <CheckCircle className='h-4 w-4' />
            <span>Document processed successfully</span>
          </div>
        );
      case 'error':
        return (
          <div className='flex items-center gap-2 text-red-600'>
            <AlertCircle className='h-4 w-4' />
            <span>Error processing document</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-lg'>Upload CV</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          <div className='flex justify-center'>
            <label
              htmlFor='firebase-cv-upload'
              className='cursor-pointer flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors'>
              <Upload className='h-10 w-10 text-gray-400 mb-2' />
              <span className='text-sm text-gray-500 mb-1'>Upload your CV</span>
              <span className='text-xs text-gray-400'>
                Upload your PDF, Word, or LaTeX document
              </span>
              <input
                id='firebase-cv-upload'
                type='file'
                className='hidden'
                accept='.pdf,.doc,.docx,.tex'
                onChange={handleFileUpload}
                disabled={
                  status === 'uploading' ||
                  status === 'parsing' ||
                  status === 'saving'
                }
              />
            </label>
          </div>

          <div className='text-center'>{renderStatusIndicator()}</div>

          {pdfUrl && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline' className='w-full'>
                  <Eye className='h-4 w-4 mr-2' /> Preview PDF
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
                <div className='pdf-container'>
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className='pdf-document'>
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={550}
                        className='pdf-page mb-4 border'
                      />
                    ))}
                  </Document>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {status === 'success' && (
            <div className='bg-green-50 p-4 rounded-lg'>
              <p className='text-center text-green-700 font-medium'>
                Your CV has been processed and saved to your profile
              </p>
              <p className='text-center text-green-600 text-sm mt-1'>
                You can now customize it in the editor
              </p>
            </div>
          )}

          {status === 'error' && errorMessage && (
            <div className='bg-red-50 p-4 rounded-lg'>
              <p className='text-center text-red-700'>{errorMessage}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
