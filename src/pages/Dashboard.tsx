import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  Upload,
  Layout,
  History,
  Code,
  FileText,
  Database,
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileEditor from '@/components/ProfileEditor';
import CVSectionCard from '@/components/CVSectionCard';
import WebsiteStatusCard from '@/components/WebsiteStatusCard';
import { toast } from 'sonner';
import { useFirebase } from '@/lib/firebase/FirebaseContext';
import { getUserCVs, saveCV } from '@/lib/firebase/firestore';
import { type ParsedCV } from '@/types/parsed-cv';
import AcademicIntegrations from '@/components/AcademicIntegration';

const Dashboard = () => {
  const { currentUser } = useFirebase();
  const [cvData, setCvData] = useState<ParsedCV>({
    personalInfo: {
      name: 'Your Name',
      email: 'your.email@example.com',
      title: 'Academic Title',
      location: 'Your Institution',
    },
    education: [],
    experience: [],
    publications: [],
    skills: [],
    achievements: [],
    references: [],
  });
  const [cvId, setCvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [websiteStatus, setWebsiteStatus] = useState({
    isOnline: true,
    domain: `${
      currentUser?.displayName.toLowerCase().trim() ?? 'your-portfolio'
    }.vita-academica.app`,
  });

  useEffect(() => {
    const loadUserCV = async () => {
      if (!currentUser) return;

      setLoading(true);
      try {
        const userCVs = await getUserCVs(currentUser.uid);

        if (userCVs.length > 0) {
          const mostRecentCV = userCVs[0];
          // Merge with default template to ensure all fields exist
          setCvData((prevData) => ({
            ...prevData,
            ...(mostRecentCV as unknown as ParsedCV),
          }));
          setCvId(mostRecentCV.id as string);
          setWebsiteStatus({
            domain: `${
              cvData?.personalInfo?.name.toLowerCase().trim() ??
              websiteStatus.domain
            }.vita-academica.app`,
            isOnline: websiteStatus.isOnline,
          });
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

  const handleCVUpdate = async (updatedData: ParsedCV) => {
    if (!currentUser) {
      toast.info('Sign in to save changes to your CV');
      setCvData(updatedData);
      return;
    }

    setLoading(true);
    try {
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

  const handleToggleWebsiteStatus = () => {
    setWebsiteStatus((prev) => ({
      ...prev,
      isOnline: !prev.isOnline,
    }));

    toast.success(
      `Website is now ${websiteStatus.isOnline ? 'offline' : 'online'}`
    );
  };

  const getDefaultUserInitials = () => {
    if (cvData?.personalInfo?.name) {
      return cvData.personalInfo.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    }
    return 'U';
  };

  const navigateToUploadCV = () => {
    window.location.href = '/cv-manager';
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <DashboardSidebar />

      <div className='flex-1'>
        <DashboardHeader />

        <main className='p-6'>
          <div className='mb-6'>
            <h1 className='text-3xl font-bold'>Dashboard</h1>
            <p className='text-gray-600'>Welcome to your academic portfolio</p>
          </div>

          <div className='space-y-6'>
            <ProfileHeader
              name={cvData?.personalInfo?.name || 'Your Name'}
              title={cvData?.personalInfo?.title || 'Academic Title'}
              institution={cvData?.personalInfo?.location || 'Institution'}
              initials={getDefaultUserInitials()}
              imageUrl={cvData?.personalInfo?.image}
              onEdit={() => setIsProfileEditorOpen(true)}
            />

            <ProfileEditor
              cvData={cvData}
              onUpdate={handleCVUpdate}
              open={isProfileEditorOpen}
              onOpenChange={setIsProfileEditorOpen}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <CVSectionCard
                title='Education'
                icon={
                  <GraduationCap className='h-5 w-5 text-academic-orange' />
                }
                type='education'
                items={cvData.education || []}
                cvData={cvData}
                onUpdate={handleCVUpdate}
              />

              <CVSectionCard
                title='Experience'
                icon={<Briefcase className='h-5 w-5 text-academic-orange' />}
                type='experience'
                items={cvData.experience || []}
                cvData={cvData}
                onUpdate={handleCVUpdate}
              />

              <CVSectionCard
                title='Publications'
                icon={<BookOpen className='h-5 w-5 text-academic-orange' />}
                type='publications'
                items={cvData.publications || []}
                cvData={cvData}
                onUpdate={handleCVUpdate}
              />

              <CVSectionCard
                title='Achievements'
                icon={<Award className='h-5 w-5 text-academic-orange' />}
                type='achievements'
                items={cvData.achievements || []}
                cvData={cvData}
                onUpdate={handleCVUpdate}
              />

              <CVSectionCard
                title='Skills'
                icon={<Code className='h-5 w-5 text-academic-orange' />}
                type='skills'
                items={cvData.skills || []}
                cvData={cvData}
                onUpdate={handleCVUpdate}
              />

              <CVSectionCard
                title='References'
                icon={<Database className='h-4 w-4 text-academic-orange' />}
                type='references'
                items={cvData.references || []}
                cvData={cvData}
                onUpdate={handleCVUpdate}
              />
            </div>

            <h2 className='text-xl font-semibold mt-8 mb-4'>
              Tools & Integrations
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-lg font-medium'>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <Button
                      variant='outline'
                      className='w-full justify-start'
                      onClick={() => (window.location.href = '/cv-manager')}>
                      <FileText className='mr-2 h-4 w-4' /> Manage CV
                    </Button>
                    <Button
                      variant='outline'
                      className='w-full justify-start'
                      onClick={() =>
                        (window.location.href = '/website-builder')
                      }>
                      <Layout className='mr-2 h-4 w-4' /> Generate Website
                    </Button>
                    <Button
                      variant='outline'
                      className='w-full justify-start'
                      onClick={() => (window.location.href = '/activity')}>
                      <History className='mr-2 h-4 w-4' /> Activity History
                    </Button>
                    <Button
                      variant='outline'
                      className='w-full justify-start'
                      onClick={navigateToUploadCV}>
                      <Upload className='mr-2 h-4 w-4' /> Upload CV
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <AcademicIntegrations />

              <WebsiteStatusCard
                domain={websiteStatus.domain}
                isOnline={websiteStatus.isOnline}
                onToggleStatus={handleToggleWebsiteStatus}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
