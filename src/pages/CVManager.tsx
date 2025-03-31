import { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import CVExporter from '@/components/CVExporter';
import CVPreview from '@/components/CVPreview';
import DocumentViewer from '@/components/DocumentViewer';
import { exportCV, getDocumentMetadata } from '@/services/documentParser';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
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

  const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
  };

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
    if (!cvData) {
      toast.error('No CV data to export');
      return;
    }

    try {
      const exportUrl = await exportCV(
        cvData,
        format as 'pdf' | 'word' | 'latex'
      );
      toast.success(`CV exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting CV:', error);
      toast.error(`Failed to export CV as ${format.toUpperCase()}`);
    }
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) {
      toast.error('Section title is required');
      return;
    }

    if (!cvData) {
      toast.error('No CV data available');
      return;
    }

    const updatedCvData = { ...cvData };

    // Initialize customSections array if it doesn't exist
    if (!updatedCvData.customSections) {
      updatedCvData.customSections = [];
    }

    // Add the new custom section
    updatedCvData.customSections.push({
      id: uuidv4(),
      title: newSectionTitle,
      content: newSectionContent,
    });

    // Update the CV data
    handleCVUpdate(updatedCvData);

    // Reset form and close dialog
    setNewSectionTitle('');
    setNewSectionContent('');
    setShowAddSectionDialog(false);

    toast.success('Custom section added successfully');
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
                    <FirebaseCVUploader
                      onParsed={handleCVParsed}
                      onFileSelected={handleFileSelected}
                    />
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
                    <CVExporter
                      cvData={cvData}
                      onExport={handleExport}
                      visibleSections={sections}
                    />

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
                          {/* Custom sections toggle */}
                          {cvData.customSections &&
                            cvData.customSections.length > 0 && (
                              <div className='pt-2 border-t mt-2'>
                                <p className='text-sm font-medium mb-2'>
                                  Custom Sections
                                </p>
                                {cvData.customSections.map((section) => (
                                  <div
                                    key={section.id}
                                    className='flex items-center justify-between mb-2'>
                                    <Label
                                      htmlFor={`custom-section-${section.id}`}
                                      className='text-sm'>
                                      {section.title}
                                    </Label>
                                    {/* We could add toggle functionality for custom sections here if needed */}
                                  </div>
                                ))}
                              </div>
                            )}

                          <Dialog
                            open={showAddSectionDialog}
                            onOpenChange={setShowAddSectionDialog}>
                            <DialogTrigger asChild>
                              <Button variant='outline' className='w-full mt-2'>
                                <Plus className='h-4 w-4 mr-2' /> Add Custom
                                Section
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Custom Section</DialogTitle>
                              </DialogHeader>
                              <div className='space-y-4 py-4'>
                                <div className='space-y-2'>
                                  <Label htmlFor='section-title'>
                                    Section Title
                                  </Label>
                                  <Input
                                    id='section-title'
                                    value={newSectionTitle}
                                    onChange={(e) =>
                                      setNewSectionTitle(e.target.value)
                                    }
                                    placeholder='e.g., Projects, Certifications, etc.'
                                  />
                                </div>
                                <div className='space-y-2'>
                                  <Label htmlFor='section-content'>
                                    Content
                                  </Label>
                                  <Textarea
                                    id='section-content'
                                    value={newSectionContent}
                                    onChange={(e) =>
                                      setNewSectionContent(e.target.value)
                                    }
                                    placeholder='Enter the content for this section...'
                                    className='min-h-[150px]'
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  variant='outline'
                                  onClick={() =>
                                    setShowAddSectionDialog(false)
                                  }>
                                  Cancel
                                </Button>
                                <Button onClick={handleAddSection}>
                                  Add Section
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
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
                          <div className='px-6 pb-4'>
                            <TabsList className='grid w-full grid-cols-2 pb-6'>
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
                            className='flex-1 overflow-auto m-0'>
                            <div className='h-full px-6 pb-6'>
                              <CVPreview
                                cvData={cvData}
                                onCVUpdate={handleCVUpdate}
                                visibleSections={sections}
                              />
                            </div>
                          </TabsContent>

                          {/* <TabsContent
                            value='document'
                            className='flex-1 overflow-hidden m-0 p-0'>
                            <div className='h-full overflow-auto px-6 pb-6'>
                              <PDFViewer file={selectedFile}></PDFViewer>
                            </div>
                          </TabsContent> */}

                          <TabsContent
                            value='document'
                            className='flex-1 overflow-auto m-0'>
                            <div className='h-full px-6 pb-6'>
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
