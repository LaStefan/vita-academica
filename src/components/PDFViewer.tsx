// src/components/PDFViewer.tsx
import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, ExternalLink } from 'lucide-react';
import { setupPdfWorker } from '@/lib/utils/pdfWorker';

interface PDFViewerProps {
  file: string | File | null;
}

export function PDFViewer({ file }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useIframe, setUseIframe] = useState(false);

  useEffect(() => {
    if (!file) return;

    // If the file is from localhost (emulator), default to iframe
    if (typeof file === 'string' && file.includes('localhost')) {
      setUseIframe(true);
    }
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully with', numPages, 'pages');
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error('Error loading PDF:', err);
    setError('Failed to load PDF. Switching to alternative viewer.');
    setUseIframe(true);
    setLoading(false);
  };

  if (!file) {
    return (
      <Card>
        <CardContent className='p-6 text-center text-gray-500'>
          No PDF file available for preview
        </CardContent>
      </Card>
    );
  }

  // Use iframe as fallback or for emulator URLs
  if (useIframe && typeof file === 'string') {
    return (
      <Card className='overflow-hidden'>
        <CardContent className='p-0'>
          <iframe
            src={file}
            width='100%'
            height='600px'
            style={{ border: 'none' }}
            title='PDF Viewer'
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='overflow-hidden'>
      <CardContent className='p-4'>
        {loading && !error && (
          <div className='flex justify-center items-center p-10'>
            <Loader2 className='h-10 w-10 animate-spin text-gray-400' />
          </div>
        )}

        {error && (
          <div className='bg-red-50 p-4 rounded-md text-red-600 mb-4'>
            <p>{error}</p>
            {typeof file === 'string' && (
              <div className='mt-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setUseIframe(true)}>
                  Use alternative viewer
                </Button>
                <a
                  href={file}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='ml-2 text-blue-600 hover:underline inline-flex items-center'>
                  Open PDF directly <ExternalLink className='h-4 w-4 ml-1' />
                </a>
              </div>
            )}
          </div>
        )}

        {!useIframe && (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            className='flex justify-center'>
            <Page
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              width={550}
              className='mb-4'
            />
          </Document>
        )}

        {numPages !== null && numPages > 0 && !error && !useIframe && (
          <div className='flex justify-between items-center mt-4'>
            <Button
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              variant='outline'
              size='sm'>
              <ChevronLeft className='h-4 w-4 mr-1' /> Previous
            </Button>

            <p className='text-sm text-gray-600'>
              Page {pageNumber} of {numPages}
            </p>

            <Button
              onClick={() =>
                setPageNumber((p) => Math.min(numPages || 1, p + 1))
              }
              disabled={pageNumber >= (numPages || 1)}
              variant='outline'
              size='sm'>
              Next <ChevronRight className='h-4 w-4 ml-1' />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
