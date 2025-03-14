
import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import ProfileHeader from "@/components/ProfileHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  BookOpen,
  Award,
  Briefcase,
  GraduationCap,
  Users,
  Link as LinkIcon,
  ExternalLink
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const Profile = () => {
  const [openDialog, setOpenDialog] = useState(false);
  
  const handleEditProfile = () => {
    // In a real app, this would navigate to edit page or open a modal
    toast.info("Profile editing can be done in the Settings page");
  };

  return (
    <div className="flex min-h-screen bg-academic-light">
      <DashboardSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="p-6 space-y-6">
          <ProfileHeader
            name="Dr. Jane Smith"
            title="Associate Professor"
            institution="Utrecht University"
            initials="JS"
            onEdit={handleEditProfile}
          />
          
          <Tabs defaultValue="publications">
            <TabsList className="mb-4">
              <TabsTrigger value="publications">Publications</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="publications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-academic-orange" />
                    Recent Publications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            Smith, J., et al. (2023). "Advances in Academic Portfolio Management"
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Journal of Academic Research, 45(3), 234-245
                          </p>
                        </div>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">Details</span>
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent>
                            <div className="text-sm">
                              <strong>Abstract:</strong> This paper explores new methodologies 
                              for managing academic portfolios in digital environments.
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">Portfolio Management</Badge>
                        <Badge variant="outline">Digital Tools</Badge>
                        <Badge variant="outline">Academia</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="education" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-academic-orange" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-medium">PhD in Computer Science</h3>
                    <p className="text-gray-600">Stanford University, 2015</p>
                    <p className="text-sm mt-2">
                      Thesis: "Computational Methods for Academic Research Management"
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-medium">MSc in Software Engineering</h3>
                    <p className="text-gray-600">MIT, 2011</p>
                  </div>
                  <div>
                    <h3 className="font-medium">BSc in Computer Science</h3>
                    <p className="text-gray-600">University of California, 2009</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="experience" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-academic-orange" />
                    Professional Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-medium">Associate Professor</h3>
                    <p className="text-gray-600">Utrecht University, 2018 - Present</p>
                    <p className="text-sm mt-2">
                      Teaching advanced courses in software engineering and conducting research 
                      on academic portfolio management systems.
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-medium">Assistant Professor</h3>
                    <p className="text-gray-600">University of Amsterdam, 2015 - 2018</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Research Assistant</h3>
                    <p className="text-gray-600">Stanford University, 2012 - 2015</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-academic-orange" />
                    Research Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-medium">Academic Portfolio Platform Development</h3>
                    <p className="text-gray-600">2020 - Present</p>
                    <p className="text-sm mt-2">
                      Leading a team developing innovative solutions for academic CV management and portfolio generation.
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-medium">Digital Transformation in Higher Education</h3>
                    <p className="text-gray-600">2018 - 2020</p>
                  </div>
                  <div>
                    <h3 className="font-medium">AI for Academic Research Optimization</h3>
                    <p className="text-gray-600">2016 - 2018</p>
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

export default Profile;
