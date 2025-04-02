import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, Download, Eye, Search } from 'lucide-react';
import { ActivityItem } from '@/types/activity';
import { Button } from '@/components/ui/button';
import DocumentHistoryItem from '@/components/DocumentHistoryItem';
import { Loader2 } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useState, useEffect } from 'react';
import { getUserActivities, getUserCVs } from '@/lib/firebase/firestore';
import { useFirebase } from '@/lib/firebase/FirebaseContext';
import { Input } from '@/components/ui/input';

const mockActivities: ActivityItem[] = [
  {
    id: 1,
    type: 'upload',
    title: 'CV Uploaded',
    description: 'You uploaded your curriculum vitae',
    date: 'Today, 10:45 AM',
  },
  {
    id: 2,
    type: 'edit',
    title: 'Profile Updated',
    description: 'You updated your personal information',
    date: 'Today, 11:20 AM',
  },
  {
    id: 3,
    type: 'edit',
    title: 'Publications Updated',
    description: 'You added 2 new publications to your profile',
    date: 'Yesterday, 3:15 PM',
  },
  {
    id: 4,
    type: 'download',
    title: 'CV Exported',
    description: 'You exported your CV as PDF',
    date: 'Yesterday, 4:30 PM',
  },
  {
    id: 5,
    type: 'website',
    title: 'Website Generated',
    description: 'You generated your academic website',
    date: 'Mar 15, 2024, 2:45 PM',
  },
  {
    id: 6,
    type: 'share',
    title: 'Content Shared',
    description: 'You shared your publications to LinkedIn',
    date: 'Mar 14, 2024, 11:10 AM',
  },
  {
    id: 7,
    type: 'upload',
    title: 'CV Updated',
    description: 'You uploaded a new version of your CV',
    date: 'Mar 10, 2024, 9:30 AM',
  },
  {
    id: 8,
    type: 'download',
    title: 'CV Exported',
    description: 'You exported your CV as LaTeX',
    date: 'Mar 8, 2024, 5:15 PM',
  },
];

const ActivityHistory = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { currentUser } = useFirebase();

  useEffect(() => {
    const loadActivities = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get user activities from Firestore
        const userActivities = await getUserActivities(currentUser.uid);

        // Get user CV documents
        const userCVs = await getUserCVs(currentUser.uid);

        // Format CV documents as activities
        const cvActivities: ActivityItem[] = userCVs.map((cv: any, index) => ({
          id: 1000 + index, // Use a high starting ID to avoid conflicts
          type: 'upload',
          title: cv.personalInfo?.name || 'CV Document',
          description: `CV document ${
            cv.createdAt
              ? new Date(cv.createdAt.toDate()).toLocaleDateString()
              : ''
          }`,
          date: cv.createdAt
            ? new Date(cv.createdAt.toDate()).toLocaleString()
            : new Date().toLocaleString(),
          icon: <FileText className='h-5 w-5 text-blue-500' />,
          filePath: cv.cvFilePath || null,
        }));

        // Convert Firestore activities to ActivityItem format
        const formattedActivities: ActivityItem[] = userActivities.map(
          (activity, index) => ({
            id: index + 1,
            type: activity.type || 'upload',
            title: activity.title || 'Activity',
            description: activity.description || '',
            date: activity.date || new Date().toISOString(),
            icon: getIconForType(activity.type || 'upload'),
            ...(activity.timestamp && { timestamp: activity.timestamp }),
            ...(activity.filePath && { filePath: activity.filePath }),
          })
        );

        // Combine both types of activities
        const allActivities = [...formattedActivities, ...cvActivities];

        // Sort by date (newest first)
        allActivities.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });

        setActivities(
          allActivities.length > 0 ? allActivities : mockActivities
        );
      } catch (error) {
        console.error('Error loading activities:', error);
        setActivities(mockActivities);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [currentUser]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'upload':
        return <FileText className='h-5 w-5 text-blue-500' />;
      case 'download':
        return <Download className='h-5 w-5 text-green-500' />;
      case 'edit':
        return <FileText className='h-5 w-5 text-yellow-500' />;
      case 'share':
        return <Eye className='h-5 w-5 text-purple-500' />;
      case 'website':
        return <FileText className='h-5 w-5 text-indigo-500' />;
      default:
        return <Clock className='h-5 w-5 text-gray-500' />;
    }
  };

  const filterActivities = (activities: ActivityItem[]) => {
    let filtered = activities;

    // Apply type filter
    if (activeTab !== 'all') {
      filtered = filtered.filter((activity) => activity.type === activeTab);
    }

    // Apply search filter
    if (filter) {
      const searchTerm = filter.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchTerm) ||
          activity.description.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  };

  return (
    <div className='flex min-h-screen bg-academic-light'>
      <DashboardSidebar />

      <div className='flex-1'>
        <DashboardHeader />

        <main className='p-6'>
          <div className='mb-6'>
            <h1 className='text-3xl font-bold'>Activity History</h1>
            <p className='text-gray-600'>
              Track your document history and recent activities
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center'>
                <Clock className='mr-2 h-5 w-5' /> Activity & Document History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center mb-4'>
                <div className='relative flex-1'>
                  <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
                  <Input
                    type='text'
                    placeholder='Search activities...'
                    className='pl-9'
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </div>
                <Button
                  variant='outline'
                  className='ml-2'
                  onClick={() => setFilter('')}>
                  Clear
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className='mb-4'>
                  <TabsTrigger value='all'>All</TabsTrigger>
                  <TabsTrigger value='upload'>Uploads</TabsTrigger>
                  <TabsTrigger value='edit'>Edits</TabsTrigger>
                  <TabsTrigger value='download'>Downloads</TabsTrigger>
                  <TabsTrigger value='share'>Shares</TabsTrigger>
                  <TabsTrigger value='website'>Websites</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className='mt-0'>
                  {loading ? (
                    <div className='flex justify-center items-center py-8'>
                      <Loader2 className='h-8 w-8 animate-spin text-academic-orange' />
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {filterActivities(activities).length > 0 ? (
                        filterActivities(activities).map((activity) => (
                          <DocumentHistoryItem
                            key={activity.id}
                            activity={activity}
                          />
                        ))
                      ) : (
                        <div className='text-center py-8 text-gray-500'>
                          <p>No activities found.</p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ActivityHistory;
