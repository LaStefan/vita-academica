import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileUp,
  Eye,
} from 'lucide-react';
import { parseDocument } from '@/services/documentParser';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebase } from '@/lib/firebase/FirebaseContext';
import { ParsedCV } from '@/types/parsed-cv';

type ParserStatus = 'idle' | 'uploading' | 'parsing' | 'success' | 'error';

export const CVParser = ({
  onParsed,
}: {
  onParsed?: (data: ParsedCV) => void;
}) => {
  const [parsedData, setParsedData] = useState<ParsedCV | null>(null);
  const [status, setStatus] = useState<ParserStatus>('idle');
  const [activeTab, setActiveTab] = useState('upload');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { currentUser } = useFirebase();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
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

      // Process the document
      let data: ParsedCV;
      if (currentUser) {
        data = await parseDocument(file, currentUser.uid);
      } else {
        // Just parse the document without uploading if not logged in
        data = await parseDocument(file);
      }

      setParsedData(data);
      setStatus('success');
      setActiveTab('preview');

      // Call the callback if provided
      if (onParsed) {
        onParsed(data);
      }

      toast.success('Document processed successfully!');
    } catch (error: any) {
      console.error('Error processing file:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to process document');
      toast.error(error.message || 'Failed to process document');
    }
  };

  const renderStatusIndicator = () => {
    switch (status) {
      case 'uploading':
      case 'parsing':
        return (
          <div className='flex items-center gap-2 text-yellow-600'>
            <Loader2 className='h-4 w-4 animate-spin' />
            <span>
              {status === 'uploading' ? 'Processing...' : 'Creating profile...'}
            </span>
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

  const renderPreview = () => {
    if (!parsedData) return null;

    // If we have a document URL, show a preview or download link
    const documentPreview = parsedData.cvFileUrl ? (
      <div className='mb-6 bg-gray-50 p-4 rounded-lg'>
        <h3 className='font-medium text-lg border-b pb-2 mb-3'>
          Document Preview
        </h3>
        {parsedData.cvFileUrl.toLowerCase().endsWith('.pdf') ? (
          <div className='flex flex-col items-center'>
            <iframe
              src={parsedData.cvFileUrl}
              className='w-full h-96 border rounded mb-3'
              title='PDF Preview'
            />
            <a
              href={parsedData.cvFileUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline flex items-center'>
              <Eye className='mr-1 h-4 w-4' /> Open in new tab
            </a>
          </div>
        ) : (
          <div className='flex justify-center'>
            <a
              href={parsedData.cvFileUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center'>
              <FileUp className='mr-2 h-4 w-4' /> Download Document
            </a>
          </div>
        )}
      </div>
    ) : null;

    return (
      <div className='space-y-6'>
        {documentPreview}

        {parsedData.personalInfo && (
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-medium text-lg border-b pb-2 mb-3'>
              Personal Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div>
                <p className='font-semibold text-xl'>
                  {parsedData.personalInfo.name}
                </p>
                <p className='text-gray-600'>{parsedData.personalInfo.title}</p>
              </div>
              <div className='text-right'>
                <p>{parsedData.personalInfo.email}</p>
                {parsedData.personalInfo.phone && (
                  <p>{parsedData.personalInfo.phone}</p>
                )}
                {parsedData.personalInfo.location && (
                  <p>{parsedData.personalInfo.location}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {parsedData.summary && (
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-medium text-lg border-b pb-2 mb-3'>Summary</h3>
            <p className='text-gray-700'>{parsedData.summary}</p>
          </div>
        )}

        {parsedData.education && parsedData.education.length > 0 && (
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-medium text-lg border-b pb-2 mb-3'>
              Education
            </h3>
            <div className='space-y-4'>
              {parsedData.education.map((edu, index) => (
                <div
                  key={index}
                  className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                  <div className='md:col-span-2'>
                    <p className='font-medium'>{edu.degree}</p>
                    <p className='text-gray-600'>{edu.institution}</p>
                    {edu.description && (
                      <p className='text-sm text-gray-500 mt-1'>
                        {edu.description}
                      </p>
                    )}
                  </div>
                  <div className='text-right'>
                    <p className='text-gray-600'>{edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {parsedData.experience && parsedData.experience.length > 0 && (
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-medium text-lg border-b pb-2 mb-3'>
              Experience
            </h3>
            <div className='space-y-4'>
              {parsedData.experience.map((exp, index) => (
                <div
                  key={index}
                  className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                  <div className='md:col-span-2'>
                    <p className='font-medium'>{exp.title}</p>
                    <p className='text-gray-600'>{exp.company}</p>
                    <p className='text-sm text-gray-500 mt-1'>
                      {exp.description}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-gray-600'>{exp.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {parsedData.publications && parsedData.publications.length > 0 && (
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-medium text-lg border-b pb-2 mb-3'>
              Publications
            </h3>
            <div className='space-y-4'>
              {parsedData.publications.map((pub, index) => (
                <div key={index} className='grid grid-cols-1 gap-1'>
                  <p className='font-medium'>{pub.title}</p>
                  <p className='text-gray-600'>{pub.authors}</p>
                  <p className='text-sm'>
                    {pub.venue}, {pub.year}
                  </p>
                  {pub.link && (
                    <a
                      href={pub.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-500 text-sm'>
                      View Publication
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {parsedData.skills && parsedData.skills.length > 0 && (
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-medium text-lg border-b pb-2 mb-3'>Skills</h3>
            <div className='flex flex-wrap gap-2'>
              {parsedData.skills.map((skill, index) => (
                <span
                  key={index}
                  className='bg-gray-200 px-3 py-1 rounded-full text-sm'>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {parsedData.languages && parsedData.languages.length > 0 && (
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-medium text-lg border-b pb-2 mb-3'>
              Languages
            </h3>
            <div className='space-y-2'>
              {parsedData.languages.map((lang, index) => (
                <div key={index} className='flex justify-between'>
                  <span>{lang.language}</span>
                  <span className='text-gray-600'>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {parsedData.achievements && parsedData.achievements.length > 0 && (
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-medium text-lg border-b pb-2 mb-3'>
              Achievements
            </h3>
            <ul className='list-disc pl-5 space-y-1'>
              {parsedData.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}

        <div className='flex justify-end gap-3 mt-6'>
          <Button variant='outline' onClick={() => setActiveTab('upload')}>
            Upload Another
          </Button>
          <Button
            onClick={() => {
              if (currentUser) {
                toast.success('CV saved to your profile');
                if (onParsed && parsedData) {
                  onParsed(parsedData);
                }
              } else {
                toast.info('Create an account to save your CV');
              }
            }}>
            <FileText className='mr-2 h-4 w-4' />
            Save CV
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-lg'>Import CV</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='mb-4'>
            <TabsTrigger value='upload'>Upload Document</TabsTrigger>
            <TabsTrigger value='preview' disabled={!parsedData}>
              Preview CV
            </TabsTrigger>
          </TabsList>

          <TabsContent value='upload' className='space-y-4'>
            <div className='flex justify-center'>
              <label
                htmlFor='cv-upload'
                className='cursor-pointer flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors'>
                <Upload className='h-10 w-10 text-gray-400 mb-2' />
                <span className='text-sm text-gray-500 mb-1'>
                  Upload your CV
                </span>
                <span className='text-xs text-gray-400'>
                  Supported formats: PDF, Word, LaTeX
                </span>
                <input
                  id='cv-upload'
                  type='file'
                  className='hidden'
                  accept='.pdf,.doc,.docx,.tex'
                  onChange={handleFileUpload}
                  disabled={status === 'uploading' || status === 'parsing'}
                />
              </label>
            </div>

            <div className='text-center'>
              {renderStatusIndicator()}
              {errorMessage && (
                <p className='text-red-600 text-sm mt-2'>{errorMessage}</p>
              )}
            </div>

            {!currentUser && (
              <div className='bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 mt-2'>
                <p>Sign in to save your CV to your profile.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value='preview'>{renderPreview()}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
