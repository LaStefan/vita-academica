import { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import CVExporter from '@/components/CVExporter';
import CVPreview from '@/components/CVPreview';
import DocumentViewer from '@/components/DocumentViewer';
import { getDocumentMetadata } from '@/services/documentParser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useFirebase } from '@/lib/firebase/FirebaseContext';
import { getUserCVs, saveCV } from '@/lib/firebase/firestore';
import { FirebaseCVUploader } from '@/components/FirebaseCVUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParsedCV } from '@/types/parsed-cv';
import { PDFViewer } from '@/components/PDFViewer';

const CVManager = () => {
  const { currentUser } = useFirebase();
  const [cvData, setCvData] = useState<ParsedCV | null>(null);
  const [cvId, setCvId] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('preview');
  const [sections, setSections] = useState({
    education: true,
    experience: true,
    achievements: true,
    publications: true,
    skills: true,
    languages: true,
    references: true,
    summary: true,
  });

  useEffect(() => {
    // Load CV data from Firestore if user is logged in
    const loadUserCV = async () => {
      if (!currentUser) return;

      setLoading(true);
      try {
        const userCVs = await getUserCVs(currentUser.uid);
        if (userCVs.length > 0) {
          // Get the most recently updated CV
          const mostRecentCV = userCVs[0];
          setCvData(mostRecentCV as unknown as ParsedCV);
          setCvId(mostRecentCV.id as string);

          toast.success('Loaded your most recent CV');
        }
      } catch (error) {
        console.error('Error loading user CV data:', error);
        toast.error('Failed to load your CV data');
      } finally {
        setLoading(false);
      }
    };

    loadUserCV();
  }, [currentUser]);

  const handleSectionToggle = (section: string) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const handleCVParsed = (data: ParsedCV & { id?: string }) => {
    console.log('CV parsed successfully, updating state:', data);
    setCvData(data);

    // Set cvId if it was returned from the uploader (meaning it was already saved)
    if (data.id) {
      console.log('Setting CV ID from uploader:', data.id);
      setCvId(data.id);
    }

    toast.success('CV uploaded successfully');
  };

  const handleCVUpdate = async (updatedData: ParsedCV) => {
    if (!currentUser) {
      toast.info('Sign in to save changes to your CV');
      setCvData(updatedData);
      return;
    }

    setLoading(true);
    try {
      // Save the updated CV to Firestore
      const savedCvId = await saveCV(
        currentUser.uid,
        updatedData,
        cvId || undefined
      );
      if (!cvId) setCvId(savedCvId);

      setCvData(updatedData);
      toast.success('CV updated successfully');
    } catch (error) {
      console.error('Error updating CV:', error);
      toast.error('Failed to update CV');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: string) => {
    // This will be handled by the CVExporter component
    console.log(`Exporting CV as ${format}`);
  };

  // Get document metadata for the DocumentViewer component
  const documentMetadata = cvData?.cvFileUrl
    ? getDocumentMetadata(
        cvData.cvFileUrl,
        `${cvData.personalInfo?.name}'s CV` || 'Document'
      )
    : undefined;

  return (
    <div className='flex min-h-screen bg-academic-light'>
      <DashboardSidebar />

      <div className='flex-1'>
        <DashboardHeader />

        <main className='p-6'>
          <div className='mb-6'>
            <h1 className='text-3xl font-bold'>CV Manager</h1>
            <p className='text-gray-600'>
              Upload, edit, customize and export your CV
            </p>
          </div>

          {loading ? (
            <div className='flex justify-center items-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-academic-orange' />
              <span className='ml-2 text-academic-orange'>
                Loading your CV data...
              </span>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-3'>
                {!cvData ? (
                  <div className='mb-6'>
                    <FirebaseCVUploader onParsed={handleCVParsed} />
                  </div>
                ) : (
                  <div className='mb-6'>
                    <Card>
                      <CardHeader className='flex flex-row items-center justify-between'>
                        <CardTitle className='text-lg'>Your CV</CardTitle>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setCvData(null)}>
                          Upload New CV
                        </Button>
                      </CardHeader>
                    </Card>
                  </div>
                )}
              </div>

              {cvData && (
                <>
                  <div className='lg:col-span-1 space-y-6'>
                    <CVExporter cvData={cvData} onExport={handleExport} />

                    <Card>
                      <CardHeader>
                        <CardTitle className='text-lg'>Sections</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-3'>
                          {Object.entries(sections).map(
                            ([section, isVisible]) => (
                              <div
                                key={section}
                                className='flex items-center justify-between'>
                                <Label
                                  htmlFor={`section-${section}`}
                                  className='capitalize'>
                                  {section}
                                </Label>
                                <Switch
                                  id={`section-${section}`}
                                  checked={isVisible}
                                  onCheckedChange={() =>
                                    handleSectionToggle(section)
                                  }
                                />
                              </div>
                            )
                          )}

                          <Button variant='outline' className='w-full mt-2'>
                            <Plus className='h-4 w-4 mr-2' /> Add Custom Section
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className='lg:col-span-2'>
                    <Card className='h-full'>
                      <CardHeader>
                        <CardTitle className='text-lg'>CV Preview</CardTitle>
                      </CardHeader>
                      <CardContent className='p-0 h-[700px]'>
                        <Tabs
                          defaultValue='preview'
                          value={activeTab}
                          onValueChange={setActiveTab}
                          className='h-full flex flex-col'>
                          <div className='px-6 pt-2'>
                            <TabsList className='grid w-full grid-cols-2'>
                              <TabsTrigger value='preview'>
                                CV Preview
                              </TabsTrigger>
                              <TabsTrigger value='document'>
                                Original Document
                              </TabsTrigger>
                            </TabsList>
                          </div>

                          <TabsContent
                            value='preview'
                            className='flex-1 overflow-hidden m-0 p-0'>
                            <div className='h-full overflow-auto px-6 pb-6'>
                              <CVPreview
                                cvData={cvData}
                                onCVUpdate={handleCVUpdate}
                                visibleSections={sections}
                              />
                            </div>
                          </TabsContent>

                          <TabsContent
                            value='preview'
                            className='flex-1 overflow-hidden m-0 p-0'>
                            <div className='h-full overflow-auto px-6 pb-6'>
                              {/* <PDFViewer
                            // file={file}
                            > */}
                            </div>
                          </TabsContent>

                          <TabsContent
                            value='document'
                            className='flex-1 overflow-hidden m-0 p-0'>
                            <div className='h-full overflow-auto px-6 pb-6'>
                              {cvData.cvFileUrl ? (
                                <DocumentViewer
                                  fileUrl={cvData.cvFileUrl}
                                  fileName={
                                    `${cvData.personalInfo?.name}'s CV` ||
                                    'Document'
                                  }
                                  documentInfo={documentMetadata}
                                />
                              ) : (
                                <div className='flex items-center justify-center h-full'>
                                  <p className='text-gray-500'>
                                    No original document available
                                  </p>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CVManager;
