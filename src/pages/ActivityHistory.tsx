
import React, { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import DocumentHistoryItem from "@/components/DocumentHistoryItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Download, 
  Edit, 
  FileText, 
  Layout,
  Share2,
  Calendar,
  Filter,
  Eye,
  Loader2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivityItem } from "@/types/activity";

// Mock activity data for the page
const mockActivities: ActivityItem[] = [
  {
    id: 1,
    type: "upload",
    title: "CV Uploaded",
    description: "You uploaded your curriculum vitae",
    date: "Today, 10:45 AM",
  },
  {
    id: 2,
    type: "edit",
    title: "Profile Updated",
    description: "You updated your personal information",
    date: "Today, 11:20 AM",
  },
  {
    id: 3,
    type: "edit",
    title: "Publications Updated",
    description: "You added 2 new publications to your profile",
    date: "Yesterday, 3:15 PM",
  },
  {
    id: 4,
    type: "download",
    title: "CV Exported",
    description: "You exported your CV as PDF",
    date: "Yesterday, 4:30 PM",
  },
  {
    id: 5,
    type: "website",
    title: "Website Generated",
    description: "You generated your academic website",
    date: "Mar 15, 2024, 2:45 PM",
  },
  {
    id: 6,
    type: "share",
    title: "Content Shared",
    description: "You shared your publications to LinkedIn",
    date: "Mar 14, 2024, 11:10 AM",
  },
  {
    id: 7,
    type: "upload",
    title: "CV Updated",
    description: "You uploaded a new version of your CV",
    date: "Mar 10, 2024, 9:30 AM",
  },
  {
    id: 8,
    type: "download",
    title: "CV Exported",
    description: "You exported your CV as LaTeX",
    date: "Mar 8, 2024, 5:15 PM",
  }
];

const ActivityHistory = () => {
  const [filter, setFilter] = useState<string>("all");
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data with a delay
    const loadActivities = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add icons to activities
      const activitiesWithIcons = mockActivities.map(activity => ({
        ...activity,
        icon: getIconForActivityType(activity.type)
      }));
      
      setActivities(activitiesWithIcons);
      setLoading(false);
    };
    
    loadActivities();
  }, []);
  
  // Function to get the appropriate icon based on activity type
  const getIconForActivityType = (type: string) => {
    switch (type) {
      case "upload":
        return <Upload className="h-5 w-5 text-blue-500" />;
      case "download":
        return <Download className="h-5 w-5 text-indigo-500" />;
      case "edit":
        return <Edit className="h-5 w-5 text-green-500" />;
      case "share":
        return <Share2 className="h-5 w-5 text-academic-orange" />;
      case "website":
        return <Layout className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Filter activities based on selected filter
  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  return (
    <div className="flex min-h-screen bg-academic-light">
      <DashboardSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Activity History</h1>
            <p className="text-gray-600">Track your recent activities and changes</p>
          </div>
          
          <Tabs defaultValue="timeline">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="upload">Uploads</SelectItem>
                    <SelectItem value="download">Downloads</SelectItem>
                    <SelectItem value="edit">Edits</SelectItem>
                    <SelectItem value="share">Shares</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-academic-orange" />
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      
                      <div className="space-y-6">
                        {filteredActivities.length > 0 ? (
                          filteredActivities.map(activity => (
                            <DocumentHistoryItem 
                              key={activity.id}
                              id={activity.id}
                              type={activity.type}
                              title={activity.title}
                              description={activity.description}
                              date={activity.date}
                              icon={activity.icon}
                            />
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No activities found matching your filter.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Document History</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-academic-orange" />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredActivities
                          .filter(a => a.type === "upload" || a.type === "download")
                          .map(activity => (
                            <Card key={activity.id} className="overflow-hidden">
                              <div className="bg-gray-50 p-6 flex justify-center items-center">
                                <FileText className="h-12 w-12 text-gray-300" />
                              </div>
                              <div className="p-4">
                                <h3 className="font-medium">{activity.title}</h3>
                                <p className="text-sm text-gray-500 mb-3">{activity.date}</p>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="w-full text-xs">
                                    <Eye className="h-3 w-3 mr-1" /> Preview
                                  </Button>
                                  <Button size="sm" variant="outline" className="w-full text-xs">
                                    <Download className="h-3 w-3 mr-1" /> Download
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                      </div>
                      
                      {filteredActivities.filter(a => a.type === "upload" || a.type === "download").length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No documents found matching your filter.
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calendar">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                    <Calendar className="h-16 w-16 mb-4 text-gray-300" />
                    <p className="text-center">
                      Calendar view is coming soon.
                      <br />
                      <span className="text-sm">View your activities in a monthly calendar format.</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ActivityHistory;
