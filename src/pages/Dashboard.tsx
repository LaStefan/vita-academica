import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  Upload,
  Share2,
  Layout,
  Clock,
  MoreHorizontal,
  PlusCircle,
  Linkedin,
  FileText,
  Twitter,
  Locate,
  Database,
  History,
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import ProfileHeader from '@/components/ProfileHeader';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const Dashboard = () => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState({
    education: false,
    experience: false,
    achievements: false,
    publications: false,
  });
  const [selectedPlatform, setSelectedPlatform] = useState<string>('linkedin');

  const handleShareToSocial = () => {
    toast({
      title: 'Shared successfully',
      description: `Your selected items have been shared to ${
        selectedPlatform === 'linkedin'
          ? 'LinkedIn'
          : selectedPlatform === 'twitter'
          ? 'Twitter'
          : 'the selected platform'
      }.`,
    });
    setShareDialogOpen(false);
  };

  const handleSyncWithPlatform = (platform: string) => {
    toast({
      title: 'Sync initiated',
      description: `Connecting to ${platform}. You will be notified when the synchronization is complete.`,
    });
    setSyncDialogOpen(false);

    // Simulate sync completion after 2 seconds
    setTimeout(() => {
      toast({
        title: 'Sync completed',
        description: `Your profile has been successfully synchronized with ${platform}.`,
      });
    }, 2000);
  };

  const handleCheckboxChange = (item: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [item]: !prev[item as keyof typeof prev],
    }));
  };

  return (
    <div className='flex min-h-screen bg-academic-light'>
      <DashboardSidebar />

      <div className='flex-1'>
        <DashboardHeader />

        <main className='p-6'>
          <div className='mb-6'>
            <h1 className='text-3xl font-bold'>Dashboard</h1>
            <p className='text-gray-600'>Welcome to your academic portfolio</p>
          </div>

          <div className='space-y-6'>
            {/* Profile Header */}
            <ProfileHeader
              name='Dr. Slinger Jansen'
              title='Professor Information Sciences'
              institution='Utrecht University'
              initials='DSJ'
              onEdit={() => {
                toast({
                  title: 'Edit profile',
                  description:
                    'Profile editing functionality will be available soon.',
                });
              }}
            />

            {/* Main content */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {/* Education Section */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-lg font-medium'>
                    <div className='flex items-center gap-2'>
                      <GraduationCap className='h-5 w-5 text-academic-orange' />
                      <span>Education</span>
                    </div>
                  </CardTitle>
                  <div className='flex'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <Share2 className='h-4 w-4' />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share Education</DialogTitle>
                        </DialogHeader>
                        <div className='py-4'>
                          <p className='text-sm text-gray-500 mb-4'>
                            Select where you want to share your education
                            information:
                          </p>
                          <div className='flex flex-wrap gap-3 mt-4'>
                            <Button
                              variant={
                                selectedPlatform === 'linkedin'
                                  ? 'default'
                                  : 'outline'
                              }
                              className='flex items-center gap-2'
                              onClick={() => setSelectedPlatform('linkedin')}>
                              <Linkedin className='h-4 w-4' /> LinkedIn
                            </Button>
                            <Button
                              variant={
                                selectedPlatform === 'twitter'
                                  ? 'default'
                                  : 'outline'
                              }
                              className='flex items-center gap-2'
                              onClick={() => setSelectedPlatform('twitter')}>
                              <Twitter className='h-4 w-4' /> Twitter
                            </Button>
                            <Button
                              variant={
                                selectedPlatform === 'orcid'
                                  ? 'default'
                                  : 'outline'
                              }
                              className='flex items-center gap-2'
                              onClick={() => setSelectedPlatform('orcid')}>
                              <Database className='h-4 w-4' /> ORCID
                            </Button>
                          </div>
                        </div>
                        <div className='flex justify-end gap-2 mt-2'>
                          <DialogClose asChild>
                            <Button variant='outline'>Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleShareToSocial}>Share</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div className='border-l-2 border-academic-orange pl-3 py-1'>
                      <p className='font-medium'>Ph.D. in Computer Science</p>
                      <p className='text-sm text-gray-600'>
                        Utrecht University, 2005-2009
                      </p>
                    </div>
                    <div className='border-l-2 border-gray-200 pl-3 py-1'>
                      <p className='font-medium'>M.S. in Computer Science</p>
                      <p className='text-sm text-gray-600'>
                        TU Delft, 2003-2005
                      </p>
                    </div>
                    <Button variant='outline' size='sm' className='w-full mt-2'>
                      <PlusCircle className='h-4 w-4 mr-1' /> Add Education
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Experience Section */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-lg font-medium'>
                    <div className='flex items-center gap-2'>
                      <Briefcase className='h-5 w-5 text-academic-orange' />
                      <span>Experience</span>
                    </div>
                  </CardTitle>
                  <div className='flex'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <Share2 className='h-4 w-4' />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share Experience</DialogTitle>
                        </DialogHeader>
                        <div className='py-4'>
                          <p className='text-sm text-gray-500 mb-4'>
                            Select where you want to share your experience
                            information:
                          </p>
                          <div className='flex flex-wrap gap-3 mt-4'>
                            <Button
                              variant={
                                selectedPlatform === 'linkedin'
                                  ? 'default'
                                  : 'outline'
                              }
                              className='flex items-center gap-2'
                              onClick={() => setSelectedPlatform('linkedin')}>
                              <Linkedin className='h-4 w-4' /> LinkedIn
                            </Button>
                            <Button
                              variant={
                                selectedPlatform === 'twitter'
                                  ? 'default'
                                  : 'outline'
                              }
                              className='flex items-center gap-2'
                              onClick={() => setSelectedPlatform('twitter')}>
                              <Twitter className='h-4 w-4' /> Twitter
                            </Button>
                            <Button
                              variant={
                                selectedPlatform === 'orcid'
                                  ? 'default'
                                  : 'outline'
                              }
                              className='flex items-center gap-2'
                              onClick={() => setSelectedPlatform('orcid')}>
                              <Database className='h-4 w-4' /> ORCID
                            </Button>
                          </div>
                        </div>
                        <div className='flex justify-end gap-2 mt-2'>
                          <DialogClose asChild>
                            <Button variant='outline'>Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleShareToSocial}>Share</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div className='border-l-2 border-academic-orange pl-3 py-1'>
                      <p className='font-medium'>Professor</p>
                      <p className='text-sm text-gray-600'>
                        Utrecht University, 2015-Present
                      </p>
                    </div>
                    <div className='border-l-2 border-gray-200 pl-3 py-1'>
                      <p className='font-medium'>Associate Professor</p>
                      <p className='text-sm text-gray-600'>
                        Utrecht University, 2010-2015
                      </p>
                    </div>
                    <Button variant='outline' size='sm' className='w-full mt-2'>
                      <PlusCircle className='h-4 w-4 mr-1' /> Add Experience
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements Section */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-lg font-medium'>
                    <div className='flex items-center gap-2'>
                      <Award className='h-5 w-5 text-academic-orange' />
                      <span>Achievements</span>
                    </div>
                  </CardTitle>
                  <div className='flex'>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                      <Share2 className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div className='border-l-2 border-academic-orange pl-3 py-1'>
                      <p className='font-medium'>Best Paper Award</p>
                      <p className='text-sm text-gray-600'>
                        ICSE Conference, 2022
                      </p>
                    </div>
                    <div className='border-l-2 border-gray-200 pl-3 py-1'>
                      <p className='font-medium'>Research Grant</p>
                      <p className='text-sm text-gray-600'>
                        European Research Council, 2021
                      </p>
                    </div>
                    <Button variant='outline' size='sm' className='w-full mt-2'>
                      <PlusCircle className='h-4 w-4 mr-1' /> Add Achievement
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Publications Section */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-lg font-medium'>
                    <div className='flex items-center gap-2'>
                      <BookOpen className='h-5 w-5 text-academic-orange' />
                      <span>Publications</span>
                    </div>
                  </CardTitle>
                  <div className='flex'>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                      <Share2 className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div className='border-l-2 border-academic-orange pl-3 py-1'>
                      <p className='font-medium'>
                        "Software Ecosystems Evolution"
                      </p>
                      <p className='text-sm text-gray-600'>
                        Journal of Systems and Software, 2023
                      </p>
                    </div>
                    <div className='border-l-2 border-gray-200 pl-3 py-1'>
                      <p className='font-medium'>
                        "Cloud Platforms Comparison"
                      </p>
                      <p className='text-sm text-gray-600'>
                        IEEE Conference, 2022
                      </p>
                    </div>
                    <Button variant='outline' size='sm' className='w-full mt-2'>
                      <PlusCircle className='h-4 w-4 mr-1' /> Add Publication
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-lg font-medium'>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <Button variant='outline' className='w-full justify-start'>
                      <Upload className='mr-2 h-4 w-4' /> Upload CV
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='outline'
                          className='w-full justify-start'>
                          <Share2 className='mr-2 h-4 w-4' /> Share to Social
                          Media
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share to Social Media</DialogTitle>
                        </DialogHeader>
                        <div className='py-4'>
                          <p className='text-sm text-gray-500 mb-4'>
                            Select items from your portfolio to share:
                          </p>
                          <div className='space-y-3'>
                            {Object.entries(selectedItems).map(
                              ([key, value]) => (
                                <div
                                  className='flex items-center space-x-2'
                                  key={key}>
                                  <Checkbox
                                    id={`share-${key}`}
                                    checked={value}
                                    onCheckedChange={() =>
                                      handleCheckboxChange(key)
                                    }
                                  />
                                  <Label
                                    htmlFor={`share-${key}`}
                                    className='capitalize'>
                                    {key}
                                  </Label>
                                </div>
                              )
                            )}
                          </div>
                          <div className='flex flex-wrap gap-3 mt-4'>
                            <Button
                              variant={
                                selectedPlatform === 'linkedin'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='flex items-center gap-2'
                              onClick={() => setSelectedPlatform('linkedin')}>
                              <Linkedin className='h-4 w-4' /> LinkedIn
                            </Button>
                            <Button
                              variant={
                                selectedPlatform === 'twitter'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='flex items-center gap-2'
                              onClick={() => setSelectedPlatform('twitter')}>
                              <Twitter className='h-4 w-4' /> Twitter
                            </Button>
                          </div>
                        </div>
                        <div className='flex justify-end gap-2'>
                          <DialogClose asChild>
                            <Button variant='outline'>Cancel</Button>
                          </DialogClose>
                          <Button
                            onClick={handleShareToSocial}
                            className='flex items-center gap-2'>
                            <Share2 className='h-4 w-4' /> Share
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Link to='/cv-manager'>
                      <Button
                        variant='outline'
                        className='w-full justify-start'>
                        <FileText className='mr-2 h-4 w-4' /> Manage CV
                      </Button>
                    </Link>
                    <Link to='/website'>
                      <Button
                        variant='outline'
                        className='w-full justify-start'>
                        <Layout className='mr-2 h-4 w-4' /> Generate Website
                      </Button>
                    </Link>
                    <Link to='/history'>
                      <Button
                        variant='outline'
                        className='w-full justify-start'>
                        <History className='mr-2 h-4 w-4' /> Activity History
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Integrations */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-lg font-medium'>
                    Academic Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='outline'
                          className='w-full justify-start'>
                          <Database className='mr-2 h-4 w-4' /> Sync with ORCID
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Connect with ORCID</DialogTitle>
                        </DialogHeader>
                        <div className='py-4'>
                          <p className='text-sm text-gray-500 mb-4'>
                            Connect your profile with ORCID to automatically
                            import and keep your publications and academic
                            information up to date.
                          </p>
                        </div>
                        <div className='flex justify-end gap-2'>
                          <DialogClose asChild>
                            <Button variant='outline'>Cancel</Button>
                          </DialogClose>
                          <Button
                            onClick={() => handleSyncWithPlatform('ORCID')}
                            className='flex items-center gap-2'>
                            <Database className='h-4 w-4' /> Connect
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='outline'
                          className='w-full justify-start'>
                          <Database className='mr-2 h-4 w-4' /> Sync with Pure
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Connect with Pure</DialogTitle>
                        </DialogHeader>
                        <div className='py-4'>
                          <p className='text-sm text-gray-500 mb-4'>
                            Connect your profile with Pure to automatically
                            import and keep your research information
                            synchronized with your institutional repository.
                          </p>
                        </div>
                        <div className='flex justify-end gap-2'>
                          <DialogClose asChild>
                            <Button variant='outline'>Cancel</Button>
                          </DialogClose>
                          <Button
                            onClick={() => handleSyncWithPlatform('Pure')}
                            className='flex items-center gap-2'>
                            <Database className='h-4 w-4' /> Connect
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='outline'
                          className='w-full justify-start'>
                          <Database className='mr-2 h-4 w-4' /> Sync with Google
                          Scholar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Connect with Google Scholar</DialogTitle>
                        </DialogHeader>
                        <div className='py-4'>
                          <p className='text-sm text-gray-500 mb-4'>
                            Connect your profile with Google Scholar to
                            automatically import your publications and citation
                            metrics.
                          </p>
                        </div>
                        <div className='flex justify-end gap-2'>
                          <DialogClose asChild>
                            <Button variant='outline'>Cancel</Button>
                          </DialogClose>
                          <Button
                            onClick={() =>
                              handleSyncWithPlatform('Google Scholar')
                            }
                            className='flex items-center gap-2'>
                            <Database className='h-4 w-4' /> Connect
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='outline'
                          className='w-full justify-start'>
                          <Database className='mr-2 h-4 w-4' /> Sync with
                          University System
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Connect with University System
                          </DialogTitle>
                        </DialogHeader>
                        <div className='py-4'>
                          <p className='text-sm text-gray-500 mb-4'>
                            Connect your profile with your university's
                            information system to automatically sync your
                            academic information.
                          </p>
                          <div className='mt-4'>
                            <Label htmlFor='university' className='text-sm'>
                              Select your university
                            </Label>
                            <select
                              id='university'
                              className='w-full p-2 border rounded mt-1'>
                              <option value='Utrecht University'>
                                Utrecht University
                              </option>
                              <option value='Stanford University'>
                                Stanford University
                              </option>
                              <option value='MIT'>MIT</option>
                              <option value='Oxford University'>
                                Oxford University
                              </option>
                              <option value='Cambridge University'>
                                Cambridge University
                              </option>
                              <option value='Harvard University'>
                                Harvard University
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className='flex justify-end gap-2'>
                          <DialogClose asChild>
                            <Button variant='outline'>Cancel</Button>
                          </DialogClose>
                          <Button
                            onClick={() =>
                              handleSyncWithPlatform('University System')
                            }
                            className='flex items-center gap-2'>
                            <Database className='h-4 w-4' /> Connect
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
