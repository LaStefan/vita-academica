
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
  History
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import ProfileHeader from "@/components/ProfileHeader";
import { toast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState({
    education: false,
    experience: false,
    achievements: false,
    publications: false
  });
  const [selectedPlatform, setSelectedPlatform] = useState<string>("linkedin");

  const handleShareToSocial = () => {
    toast({
      title: "Shared successfully",
      description: `Your selected items have been shared to ${selectedPlatform === "linkedin" ? "LinkedIn" : selectedPlatform === "twitter" ? "Twitter" : "the selected platform"}.`,
    });
    setShareDialogOpen(false);
  };

  const handleSyncWithPlatform = (platform: string) => {
    toast({
      title: "Sync initiated",
      description: `Connecting to ${platform}. You will be notified when the synchronization is complete.`,
    });
    setSyncDialogOpen(false);
    
    // Simulate sync completion after 2 seconds
    setTimeout(() => {
      toast({
        title: "Sync completed",
        description: `Your profile has been successfully synchronized with ${platform}.`,
      });
    }, 2000);
  };

  const handleCheckboxChange = (item: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [item]: !prev[item as keyof typeof prev]
    }));
  };
  
  
   /** EDUCATION */
const [educationList, setEducationList] = useState<{ university: string; studies: string; year: string }[]>([]);
const [showEducationForm, setShowEducationForm] = useState(false);
const [educationDetails, setEducationDetails] = useState({
  university: "",
  studies: "",
  year: "",
});

const handleAddEducation = () => {
  // Check if all fields are filled
  if (educationDetails.university && educationDetails.studies && educationDetails.year) {
    setEducationList((prev) => [
      ...prev,
      {
        university: educationDetails.university,
        studies: educationDetails.studies,
        year: educationDetails.year,
      },
    ]);
    setEducationDetails({ university: "", studies: "", year: "" }); // Reset form after adding
    setShowEducationForm(false); // Close form after adding education
  } else {
    alert("Please fill in all the required fields.");
  }
};

const handleCancel = () => {
  setShowEducationForm(false); // Close the form without saving
  setEducationDetails({ university: "", studies: "", year: "" }); // Clear form inputs
};


  /**  Experience       */
  const [experienceList, setexperienceList] = useState<{ Position: string; Place: string; Period: string }[]>([]);
  const [showexperienceForm, setShowexperienceForm] = useState(false);
  const [experienceDetails, setexperienceDetails] = useState({
    Position: "",
    Place: "",
    Period: "",
  });

  const handleAddexperience = () => {
    if (experienceDetails.Position && experienceDetails.Place && experienceDetails.Period) {
      setexperienceList((prev) => [
        ...prev,
        {
          Position: experienceDetails.Position,
          Place: experienceDetails.Place,
          Period: experienceDetails.Period,
        },
      ]);
      setexperienceDetails({ Position: "", Place: "", Period: "" }); // Reset form
      setShowexperienceForm(false); // Close the form after submission
    } else {
      // Handle incomplete info (toast message or error)
      alert("Please provide all the required details.");
    }
  };
 

  
  /**  Achievements       */
  const [AchievementsList, setAchievementsList] = useState<{ achievement: string; Place: string; Period: string }[]>([]);
  const [showAchievementsForm, setShowAchievementsForm] = useState(false);
  const [AchievementsDetails, setAchievementsDetails] = useState({
    achievement: "",
    Place: "",
    Period: "",
  });

  const handleAddAchievements = () => {
    if (AchievementsDetails.achievement && AchievementsDetails.Place && AchievementsDetails.Period) {
      setAchievementsList((prev) => [
        ...prev,
        {
          achievement: AchievementsDetails.achievement,
          Place: AchievementsDetails.Place,
          Period: AchievementsDetails.Period,
        },
      ]);
      setAchievementsDetails({ achievement: "", Place: "", Period: "" }); // Reset form
      setShowAchievementsForm(false); // Close the form after submission
    } else {
      // Handle incomplete info (toast message or error)
      alert("Please provide all the required details.");
    }
  };


/**  publication       */
const [publicationList, setpublicationList] = useState<{ publication: string; Place: string; Period: string }[]>([]);
const [showpublicationForm, setShowpublicationForm] = useState(false);
const [publicationDetails, setpublicationDetails] = useState({
  publication: "",
  Place: "",
  Period: "",
});

const handleAddpublication = () => {
  if (publicationDetails.publication && publicationDetails.Place && publicationDetails.Period) {
    setpublicationList((prev) => [
      ...prev,
      {
        publication: publicationDetails.publication,
        Place: publicationDetails.Place,
        Period: publicationDetails.Period,
      },
    ]);
    setpublicationDetails({ publication: "", Place: "", Period: "" }); // Reset form
    setShowpublicationForm(false); // Close the form after submission
  } else {
    // Handle incomplete info (toast message or error)
    alert("Please provide all the required details.");
  }
};

return (
  <div className="flex min-h-screen bg-academic-light">
    <DashboardSidebar />
    
    <div className="flex-1">
      <DashboardHeader />
      
      <main className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome to your academic portfolio</p>
        </div>
        
        <div className="space-y-6">
          {/* Profile Header */}
          <ProfileHeader 
            name="Dr. Slinger Jansen"
            title="Professor Information Sciences"
            institution="Utrecht University"
            initials="DSJ"
            onEdit={() => {
              toast({
                title: "Edit profile",
                description: "Profile editing functionality will be available soon.",
              });
            }}
          />
          
          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">



            {/* Education Section */}
                  <Card>
        <div className="w-full max-w-2xl p-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-academic-orange" />
                <span>Education</span>
              </div>
            </CardTitle>
            <div className="flex">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share Education</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-gray-500 mb-4">
                            Select where you want to share your education information:
                          </p>
                          <div className="flex flex-wrap gap-3 mt-4">
                            <Button
                              variant={selectedPlatform === "linkedin" ? "default" : "outline"}
                              className="flex items-center gap-2"
                              onClick={() => setSelectedPlatform("linkedin")}
                            >
                              <Linkedin className="h-4 w-4" /> LinkedIn
                            </Button>
                            <Button
                              variant={selectedPlatform === "twitter" ? "default" : "outline"}
                              className="flex items-center gap-2"
                              onClick={() => setSelectedPlatform("twitter")}
                            >
                              <Twitter className="h-4 w-4" /> Twitter
                            </Button>
                            <Button
                              variant={selectedPlatform === "orcid" ? "default" : "outline"}
                              className="flex items-center gap-2"
                              onClick={() => setSelectedPlatform("orcid")}
                            >
                              <Database className="h-4 w-4" /> ORCID
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleShareToSocial}>
                            Share
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div> 
          </CardHeader>

          <CardContent>
            {/* This div now has a smooth transition effect when expanding */}
            <div
              className={`space-y-3 overflow-hidden transition-all duration-500 ease-in-out ${
                educationList.length > 0 ? "max-h-[800px]" : "max-h-[400px]"
              }`}
            >
              {/* Education List Display */}
              {educationList.map((edu, index) => (
                <div key={index} className="border-l-2 border-academic-orange pl-3 py-1">
                  {/* University in bold */}
                  <p className="font-medium">{edu.university}</p>

                  {/* Studies and Year in smaller font, not bold */}
                  <p className="text-sm text-gray-600">
                    {edu.studies}, {edu.year}
                  </p>
                </div>
              ))}

              {/* Education Form */}
              {showEducationForm && (
                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="University Name"
                    value={educationDetails.university}
                    onChange={(e) =>
                      setEducationDetails({
                        ...educationDetails,
                        university: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Studies"
                    value={educationDetails.studies}
                    onChange={(e) =>
                      setEducationDetails({
                        ...educationDetails,
                        studies: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Year"
                    value={educationDetails.year}
                    onChange={(e) =>
                      setEducationDetails({
                        ...educationDetails,
                        year: e.target.value,
                      })
                    }
                  />
                  <div className="flex justify-between mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mr-2"
                      onClick={() => setShowEducationForm(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="default"
                      size="sm"
                      className="w-full ml-2"
                      onClick={handleAddEducation}
                    >
                      Add Education
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          {/* Button to trigger the form, centered */}
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => setShowEducationForm(true)}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add Education
            </Button>
          </div>
        </div>
      </Card>
       

        

              
              {/* Experience Section */}
              <Card>
        <div className="w-full max-w-2xl p-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-academic-orange" />
                <span>Experience</span>
              </div>
            </CardTitle>
            <div className="flex">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share Experience</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-gray-500 mb-4">
                            Select where you want to share your education information:
                          </p>
                          <div className="flex flex-wrap gap-3 mt-4">
                            <Button
                              variant={selectedPlatform === "linkedin" ? "default" : "outline"}
                              className="flex items-center gap-2"
                              onClick={() => setSelectedPlatform("linkedin")}
                            >
                              <Linkedin className="h-4 w-4" /> LinkedIn
                            </Button>
                            <Button
                              variant={selectedPlatform === "twitter" ? "default" : "outline"}
                              className="flex items-center gap-2"
                              onClick={() => setSelectedPlatform("twitter")}
                            >
                              <Twitter className="h-4 w-4" /> Twitter
                            </Button>
                            <Button
                              variant={selectedPlatform === "orcid" ? "default" : "outline"}
                              className="flex items-center gap-2"
                              onClick={() => setSelectedPlatform("orcid")}
                            >
                              <Database className="h-4 w-4" /> ORCID
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleShareToSocial}>
                            Share
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div> 
          </CardHeader>

          <CardContent>
            {/* This div now has a smooth transition effect when expanding */}
            <div
              className={`space-y-3 overflow-hidden transition-all duration-500 ease-in-out ${
                experienceList.length > 0 ? "max-h-[800px]" : "max-h-[400px]"
              }`}
            >
              {/* experience List Display */}
              {experienceList.map((edu, index) => (
                <div key={index} className="border-l-2 border-academic-orange pl-3 py-1">
                  {/* University in bold */}
                  <p className="font-medium">{edu.Position}</p>

                  {/* Studies and Year in smaller font, not bold */}
                  <p className="text-sm text-gray-600">
                    {edu.Place}, {edu.Period}
                  </p>
                </div>
              ))}

              {/* experience Form */}
              {showexperienceForm && (
                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Position "
                    value={experienceDetails.Position}
                    onChange={(e) =>
                      setexperienceDetails({
                        ...experienceDetails,
                        Position: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Place"
                    value={experienceDetails.Place}
                    onChange={(e) =>
                      setexperienceDetails({
                        ...experienceDetails,
                        Place: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Period"
                    value={experienceDetails.Period}
                    onChange={(e) =>
                      setexperienceDetails({
                        ...experienceDetails,
                        Period: e.target.value,
                      })
                    }
                  />
                  <div className="flex justify-between mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mr-2"
                      onClick={() => setShowexperienceForm(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="default"
                      size="sm"
                      className="w-full ml-2"
                      onClick={handleAddexperience}
                    >
                      Add experience
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          {/* Button to trigger the form, centered */}
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => setShowexperienceForm(true)}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add experience
            </Button>
          </div>
        </div>
      </Card>
              





      {/* Achievements Section */}
      <Card>
        <div className="w-full max-w-2xl p-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-academic-orange" />
                <span>Achievements</span>
              </div>
            </CardTitle>
            <div className="flex">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share Achievements</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-gray-500 mb-4">
                            Select where you want to share your education information:
                          </p>
                          <div className="flex flex-wrap gap-3 mt-4">
                            <Button
                              variant={selectedPlatform === "linkedin" ? "default" : "outline"}
                              className="flex items-center gap-2"
                              onClick={() => setSelectedPlatform("linkedin")}
                            >
                              <Linkedin className="h-4 w-4" /> LinkedIn
                            </Button>
                            <Button
                              variant={selectedPlatform === "twitter" ? "default" : "outline"}
                              className="flex items-center gap-2"
                              onClick={() => setSelectedPlatform("twitter")}
                            >
                              <Twitter className="h-4 w-4" /> Twitter
                            </Button>
                            <Button
                              variant={selectedPlatform === "orcid" ? "default" : "outline"}
                              className="flex items-center gap-2"
                              onClick={() => setSelectedPlatform("orcid")}
                            >
                              <Database className="h-4 w-4" /> ORCID
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleShareToSocial}>
                            Share
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div> 
          </CardHeader>

          <CardContent>
            {/* This div now has a smooth transition effect when expanding */}
            <div
              className={`space-y-3 overflow-hidden transition-all duration-500 ease-in-out ${
                AchievementsList.length > 0 ? "max-h-[800px]" : "max-h-[400px]"
              }`}
            >
              {/* Achievements List Display */}
              {AchievementsList.map((edu, index) => (
                <div key={index} className="border-l-2 border-academic-orange pl-3 py-1">
                  {/* University in bold */}
                  <p className="font-medium">{edu.achievement}</p>

                  {/* Studies and Year in smaller font, not bold */}
                  <p className="text-sm text-gray-600">
                    {edu.Place}, {edu.Period}
                  </p>
                </div>
              ))}

              {/* Achievements Form */}
              {showAchievementsForm && (
                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Achievement "
                    value={AchievementsDetails.achievement}
                    onChange={(e) =>
                      setAchievementsDetails({
                        ...AchievementsDetails,
                        achievement: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Place"
                    value={AchievementsDetails.Place}
                    onChange={(e) =>
                      setAchievementsDetails({
                        ...AchievementsDetails,
                        Place: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Year"
                    value={AchievementsDetails.Period}
                    onChange={(e) =>
                      setAchievementsDetails({
                        ...AchievementsDetails,
                        Period: e.target.value,
                      })
                    }
                  />
                  <div className="flex justify-between mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mr-2"
                      onClick={() => setShowAchievementsForm(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="default"
                      size="sm"
                      className="w-full ml-2"
                      onClick={handleAddAchievements}
                    >
                      Add Achievements
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          {/* Button to trigger the form, centered */}
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => setShowAchievementsForm(true)}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add Achievements
            </Button>
          </div>
        </div>
      </Card>





      {/* Publication */}

      <Card>
        <div className="w-full max-w-2xl p-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-academic-orange" />
                <span>Publication</span>
              </div>
            </CardTitle>
            <div className="flex">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share publication</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-gray-500 mb-4">
                            Select where you want to share your education information:
                          </p>
                          <div className="flex flex-wrap gap-3 mt-4">
                            <Button
                              variant={selectedPlatform === "linkedin" ? "default" : "outline"}
                              className="flex items-center gap-2"
                              onClick={() => setSelectedPlatform("linkedin")}
                            >
                              <Linkedin className="h-4 w-4" /> LinkedIn
                            </Button>
                            <Button
                              variant={selectedPlatform === "twitter" ? "default" : "outline"}
                              className="flex items-center gap-2"
                              onClick={() => setSelectedPlatform("twitter")}
                            >
                              <Twitter className="h-4 w-4" /> Twitter
                            </Button>
                            <Button
                              variant={selectedPlatform === "orcid" ? "default" : "outline"}
                              className="flex items-center gap-2"
                              onClick={() => setSelectedPlatform("orcid")}
                            >
                              <Database className="h-4 w-4" /> ORCID
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleShareToSocial}>
                            Share
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div> 
          </CardHeader>

          <CardContent>
            {/* This div now has a smooth transition effect when expanding */}
            <div
              className={`space-y-3 overflow-hidden transition-all duration-500 ease-in-out ${
                publicationList.length > 0 ? "max-h-[800px]" : "max-h-[400px]"
              }`}
            >
              {/* publication List Display */}
              {publicationList.map((edu, index) => (
                <div key={index} className="border-l-2 border-academic-orange pl-3 py-1">
                  {/* University in bold */}
                  <p className="font-medium">{edu.publication}</p>

                  {/* Studies and Year in smaller font, not bold */}
                  <p className="text-sm text-gray-600">
                    {edu.Place}, {edu.Period}
                  </p>
                </div>
              ))}

              {/* publication Form */}
              {showpublicationForm && (
                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Publication "
                    value={publicationDetails.publication}
                    onChange={(e) =>
                      setpublicationDetails({
                        ...publicationDetails,
                        publication: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Place"
                    value={publicationDetails.Place}
                    onChange={(e) =>
                      setpublicationDetails({
                        ...publicationDetails,
                        Place: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Year"
                    value={publicationDetails.Period}
                    onChange={(e) =>
                      setpublicationDetails({
                        ...publicationDetails,
                        Period: e.target.value,
                      })
                    }
                  />
                  <div className="flex justify-between mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mr-2"
                      onClick={() => setShowpublicationForm(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="default"
                      size="sm"
                      className="w-full ml-2"
                      onClick={handleAddpublication}
                    >
                      Add publication
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          {/* Button to trigger the form, centered */}
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => setShowpublicationForm(true)}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add publication
            </Button>
          </div>
        </div>
      </Card>


              
             
              {/* Quick Actions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="mr-2 h-4 w-4" /> Upload CV
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Share2 className="mr-2 h-4 w-4" /> Share to Social Media
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share to Social Media</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-gray-500 mb-4">
                            Select items from your portfolio to share:
                          </p>
                          <div className="space-y-3">
                            {Object.entries(selectedItems).map(([key, value]) => (
                              <div className="flex items-center space-x-2" key={key}>
                                <Checkbox 
                                  id={`share-${key}`} 
                                  checked={value}
                                  onCheckedChange={() => handleCheckboxChange(key)}
                                />
                                <Label htmlFor={`share-${key}`} className="capitalize">{key}</Label>
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-3 mt-4">
                            <Button
                              variant={selectedPlatform === "linkedin" ? "default" : "outline"}
                              size="sm"
                              className="flex items-center gap-2"
                              onClick={() => setSelectedPlatform("linkedin")}
                            >
                              <Linkedin className="h-4 w-4" /> LinkedIn
                            </Button>
                            <Button
                              variant={selectedPlatform === "twitter" ? "default" : "outline"}
                              size="sm"
                              className="flex items-center gap-2"
                              onClick={() => setSelectedPlatform("twitter")}
                            >
                              <Twitter className="h-4 w-4" /> Twitter
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleShareToSocial} className="flex items-center gap-2">
                            <Share2 className="h-4 w-4" /> Share
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Link to="/cv-manager">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" /> Manage CV
                      </Button>
                    </Link>
                    <Link to="/website">
                      <Button variant="outline" className="w-full justify-start">
                        <Layout className="mr-2 h-4 w-4" /> Generate Website
                      </Button>
                    </Link>
                    
                  </div>
                </CardContent>
              </Card>

              {/* Academic Integrations */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Academic Integrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Database className="mr-2 h-4 w-4" /> Sync with ORCID
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Connect with ORCID</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-gray-500 mb-4">
                            Connect your profile with ORCID to automatically import and keep your publications and academic information up to date.
                          </p>
                        </div>
                        <div className="flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={() => handleSyncWithPlatform("ORCID")} className="flex items-center gap-2">
                            <Database className="h-4 w-4" /> Connect
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Database className="mr-2 h-4 w-4" /> Sync with Pure
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Connect with Pure</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-gray-500 mb-4">
                            Connect your profile with Pure to automatically import and keep your research information synchronized with your institutional repository.
                          </p>
                        </div>
                        <div className="flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={() => handleSyncWithPlatform("Pure")} className="flex items-center gap-2">
                            <Database className="h-4 w-4" /> Connect
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Database className="mr-2 h-4 w-4" /> Sync with Google Scholar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Connect with Google Scholar</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-gray-500 mb-4">
                            Connect your profile with Google Scholar to automatically import your publications and citation metrics.
                          </p>
                        </div>
                        <div className="flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={() => handleSyncWithPlatform("Google Scholar")} className="flex items-center gap-2">
                            <Database className="h-4 w-4" /> Connect
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Database className="mr-2 h-4 w-4" /> Sync with University System
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Connect with University System</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-gray-500 mb-4">
                            Connect your profile with your university's information system to automatically sync your academic information.
                          </p>
                          <div className="mt-4">
                            <Label htmlFor="university" className="text-sm">Select your university</Label>
                            <select id="university" className="w-full p-2 border rounded mt-1">
                              <option value="Utrecht University">Utrecht University</option>
                              <option value="Stanford University">Stanford University</option>
                              <option value="MIT">MIT</option>
                              <option value="Oxford University">Oxford University</option>
                              <option value="Cambridge University">Cambridge University</option>
                              <option value="Harvard University">Harvard University</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={() => handleSyncWithPlatform("University System")} className="flex items-center gap-2">
                            <Database className="h-4 w-4" /> Connect
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
