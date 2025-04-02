import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  Eye,
  Download,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { DocumentMetadata } from '@/services/documentParser';

interface DocumentViewerProps {
  fileUrl?: string;
  fileName?: string;
  documentInfo?:
    | DocumentMetadata
    | {
        fileName?: string;
        type?: string;
        size?: string;
        pages?: number;
        uploadDate?: string;
        lastModified?: string;
      };
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  fileUrl,
  fileName,
  documentInfo,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);

  useEffect(() => {
    // Reset state when fileUrl changes
    if (fileUrl) {
      setPdfLoaded(false);
      setPdfError(false);
      setPdfLoading(true);
    }
  }, [fileUrl]);

  const handlePdfLoad = () => {
    setPdfLoaded(true);
    setPdfError(false);
    setPdfLoading(false);
  };

  const handlePdfError = () => {
    setPdfError(true);
    toast.error('Failed to load PDF preview', {
      description:
        'The document may be inaccessible or in an unsupported format.',
    });
  };

  if (!fileUrl) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-lg'>Document Preview</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center py-10'>
          <FileText className='h-16 w-16 text-gray-300 mb-4' />
          <p className='text-gray-500'>No document uploaded yet</p>
          <p className='text-gray-400 text-sm mt-2'>
            Upload your CV to view it here
          </p>
        </CardContent>
      </Card>
    );
  }

  const isPdf = fileUrl.toLowerCase().endsWith('.pdf');
  const displayName =
    fileName ||
    documentInfo?.fileName ||
    fileUrl.split('/').pop() ||
    'Document';
  const fileExtension = displayName.split('.').pop()?.toLowerCase() || '';

  // File type icon mapping
  const getFileIcon = () => {
    if (isPdf) return <FileText className='h-12 w-12 text-red-400 mb-3' />;

    switch (fileExtension) {
      case 'doc':
      case 'docx':
        return <FileText className='h-12 w-12 text-blue-400 mb-3' />;
      case 'tex':
        return <FileText className='h-12 w-12 text-purple-400 mb-3' />;
      default:
        return <FileText className='h-12 w-12 text-gray-400 mb-3' />;
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='text-lg'>Document Preview</CardTitle>
        <div className='flex space-x-2'>
          <a
            href={fileUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex'>
            <Button variant='outline' size='sm'>
              <Eye className='h-4 w-4 mr-1' /> View
            </Button>
          </a>
          <a href={fileUrl} download={displayName} className='inline-flex'>
            <Button variant='outline' size='sm'>
              <Download className='h-4 w-4 mr-1' /> Download
            </Button>
          </a>
        </div>
      </CardHeader>
      <CardContent>
        {isPdf ? (
          <div className='space-y-4'>
            <div className='w-full aspect-[3/4] max-h-96 bg-gray-100 rounded border overflow-hidden'>
              {pdfLoading && !pdfLoaded && !pdfError && (
                <div className='flex flex-col items-center justify-center h-full p-4 text-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-4 border-solid border-gray-200 border-t-academic-orange'></div>
                  <p className='text-gray-600 mt-4'>
                    Loading document preview...
                  </p>
                </div>
              )}

              {pdfError ? (
                <div className='flex flex-col items-center justify-center h-full p-4 text-center'>
                  <FileText className='h-12 w-12 text-gray-400 mb-3' />
                  <p className='text-gray-600 font-medium'>
                    PDF preview unavailable
                  </p>
                  <p className='text-gray-500 text-sm mb-4'>
                    The document couldn't be displayed in the preview
                  </p>
                  <a
                    href={fileUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex'>
                    <Button size='sm'>
                      <ExternalLink className='h-4 w-4 mr-2' /> Open in New Tab
                    </Button>
                  </a>
                </div>
              ) : (
                <iframe
                  src={fileUrl}
                  className={`w-full h-full transition-opacity duration-300 ${
                    pdfLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  title='PDF Preview'
                  onLoad={handlePdfLoad}
                  onError={handlePdfError}
                />
              )}
            </div>

            {/* Document Info Section */}
            {documentInfo && (
              <>
                <Button
                  variant='ghost'
                  className='w-full flex justify-between items-center'
                  onClick={() => setIsExpanded(!isExpanded)}>
                  <span>Document Information</span>
                  {isExpanded ? (
                    <ChevronUp className='h-4 w-4' />
                  ) : (
                    <ChevronDown className='h-4 w-4' />
                  )}
                </Button>

                {isExpanded && (
                  <div className='bg-gray-50 p-3 rounded'>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className='font-medium'>
                            Filename
                          </TableCell>
                          <TableCell>
                            {documentInfo.fileName || displayName}
                          </TableCell>
                        </TableRow>
                        {'type' in documentInfo && documentInfo.type && (
                          <TableRow>
                            <TableCell className='font-medium'>Type</TableCell>
                            <TableCell>{documentInfo.type}</TableCell>
                          </TableRow>
                        )}
                        {'fileType' in documentInfo &&
                          documentInfo.fileType && (
                            <TableRow>
                              <TableCell className='font-medium'>
                                Type
                              </TableCell>
                              <TableCell>{documentInfo.fileType}</TableCell>
                            </TableRow>
                          )}
                        {'size' in documentInfo && documentInfo.size && (
                          <TableRow>
                            <TableCell className='font-medium'>Size</TableCell>
                            <TableCell>{documentInfo.size}</TableCell>
                          </TableRow>
                        )}
                        {'fileSize' in documentInfo &&
                          documentInfo.fileSize && (
                            <TableRow>
                              <TableCell className='font-medium'>
                                Size
                              </TableCell>
                              <TableCell>{documentInfo.fileSize}</TableCell>
                            </TableRow>
                          )}
                        {'pages' in documentInfo && documentInfo.pages && (
                          <TableRow>
                            <TableCell className='font-medium'>Pages</TableCell>
                            <TableCell>{documentInfo.pages}</TableCell>
                          </TableRow>
                        )}
                        {'uploadDate' in documentInfo &&
                          documentInfo.uploadDate && (
                            <TableRow>
                              <TableCell className='font-medium'>
                                Uploaded
                              </TableCell>
                              <TableCell>{documentInfo.uploadDate}</TableCell>
                            </TableRow>
                          )}
                        {'lastModified' in documentInfo &&
                          documentInfo.lastModified && (
                            <TableRow>
                              <TableCell className='font-medium'>
                                Last Modified
                              </TableCell>
                              <TableCell>{documentInfo.lastModified}</TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-10 bg-gray-50 rounded'>
            {getFileIcon()}
            <p className='font-medium'>{displayName}</p>
            <p className='text-sm text-gray-500 mb-4'>
              This document requires download to view
            </p>
            <a href={fileUrl} download={displayName} className='inline-flex'>
              <Button>
                <Download className='h-4 w-4 mr-2' /> Download Document
              </Button>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentViewer;
