
import React, { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  LayoutTemplate,
  Edit,
  Plus,
  Minus,
  Save,
  Eye,
  Settings,
  Check
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WebsitePreview from "@/components/WebsitePreview";
import { ParsedCV } from "@/services/documentParser";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { db } from "@/lib/firebase/firebase";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { renderToString } from "react-dom/server";
import path from "path";

// Mock CV data for preview purposes
const mockCVData: ParsedCV = {
  personalInfo: {
    name: "Dr. Jane Smith",
    title: "Professor of Computer Science",
    email: "janesmith@university.edu",
    phone: "+1 (555) 123-4567",
    location: "New York, NY"
  },
  education: [
    {
      degree: "Ph.D. in Computer Science",
      institution: "MIT",
      year: "2015",
      description: "Thesis: Advanced Neural Networks for Natural Language Processing"
    },
    {
      degree: "M.S. in Computer Science",
      institution: "Stanford University",
      year: "2012"
    },
    {
      degree: "B.S. in Mathematics",
      institution: "University of California, Berkeley",
      year: "2010"
    }
  ],
  experience: [
    {
      title: "Associate Professor",
      company: "Columbia University",
      period: "2018 - Present",
      description: "Teaching graduate-level courses in AI and ML. Leading research in NLP applications."
    },
    {
      title: "Assistant Professor",
      company: "University of Washington",
      period: "2015 - 2018",
      description: "Taught undergraduate CS courses and published 12 papers in top conferences."
    }
  ],
  publications: [
    {
      title: "Advances in Self-Supervised Learning for Academic Research",
      authors: "Smith, J., Johnson, R., Williams, E.",
      venue: "Journal of Artificial Intelligence",
      year: "2023",
      link: "https://example.com/paper1"
    },
    {
      title: "Transformer Models in Academic Publishing",
      authors: "Smith, J., Brown, A.",
      venue: "Conference on Machine Learning",
      year: "2022"
    }
  ]
};

const WebsiteCustomization = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("academic");
  const [sections, setSections] = useState({
    about: true,
    education: true,
    experience: true,
    publications: true,
    achievements: true,
    contact: true,
    research: false,
    teaching: false
  });

  const [domain, setDomain] = useState("janesmith");
  const [theme, setTheme] = useState("light");
  const [cvData, setCvData] = useState<ParsedCV | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Load mock data for demo purposes
  useEffect(() => {
    setCvData(mockCVData);
  }, []);

  const handleSectionToggle = (section: string) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const saveWebsite = async () => {
    if (!domain || !cvData) return;

    try {
      const websiteData = {
        cvData,
        selectedTemplate,
        sections,
        domain,
        updatedAt: new Date().toISOString(),
      };

      // Save (or update) the website data in Firestore
      await setDoc(doc(collection(db, "websites"), domain), websiteData, { merge: true });

      toast.success("Website saved successfully!");
    } catch (error) {
      console.error("Error saving website:", error);
      toast.error("Failed to save website.");
    }
  };

  const handlePublish = async () => {

    try {

      const firebaseCSSURL = `https://firebasestorage.googleapis.com/v0/b/testing-vita-academica.firebasestorage.app/o/websites%2Fstyle.css?alt=media`;

      const websiteHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${domain}'s Website</title>
          <link rel="stylesheet" href="${firebaseCSSURL}">
        </head>
        <body>
          ${renderToString(
        <WebsitePreview
          cvData={cvData}
          template={selectedTemplate}
          websiteSettings={{ theme, domain, sections }}
        />
      )}
        </body>
        </html>
      `;

      const payload = {
        userId: domain,
        website: websiteHTML,
        metadata: {
          selectedTemplate,
          sections,
          theme,
          domain,
        },
      };

      const response = await fetch("https://deploywebsite-bjkal4iq7a-ew.a.run.app", // http://127.0.0.1:5005/testing-8d932/us-central1/deployWebsite" Emulator
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload }),
        });

      const result = await response.json();
      if (result.success) {
        alert(`Website Published: ${result.url}`);
      } else {
        alert("Failed to publish.");
      }
    } catch (error) {
      console.error("Publishing failed:", error);
      alert("Error publishing website.");
    }

  };


  return (
    <div className="flex min-h-screen bg-academic-light">
      <DashboardSidebar />

      <div className="flex-1">
        <DashboardHeader />

        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Website Generator</h1>
            <p className="text-gray-600">Create and customize your academic website</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Website Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`border-2 rounded-md p-2 text-center cursor-pointer ${selectedTemplate === 'academic' ? 'border-academic-orange' : 'border-gray-200'}`}
                        onClick={() => setSelectedTemplate('academic')}
                      >
                        <div className="bg-gray-100 h-24 mb-2 rounded flex items-center justify-center">
                          <LayoutTemplate className="h-10 w-10 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium">Academic</span>
                      </div>

                      <div
                        className={`border-2 rounded-md p-2 text-center cursor-pointer ${selectedTemplate === 'modern' ? 'border-academic-orange' : 'border-gray-200'}`}
                        onClick={() => setSelectedTemplate('modern')}
                      >
                        <div className="bg-gray-100 h-24 mb-2 rounded flex items-center justify-center">
                          <LayoutTemplate className="h-10 w-10 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium">Modern</span>
                      </div>

                      <div
                        className={`border-2 rounded-md p-2 text-center cursor-pointer ${selectedTemplate === 'minimal' ? 'border-academic-orange' : 'border-gray-200'}`}
                        onClick={() => setSelectedTemplate('minimal')}
                      >
                        <div className="bg-gray-100 h-24 mb-2 rounded flex items-center justify-center">
                          <LayoutTemplate className="h-10 w-10 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium">Minimal</span>
                      </div>

                      <div
                        className={`border-2 rounded-md p-2 text-center cursor-pointer ${selectedTemplate === 'portfolio' ? 'border-academic-orange' : 'border-gray-200'}`}
                        onClick={() => setSelectedTemplate('portfolio')}
                      >
                        <div className="bg-gray-100 h-24 mb-2 rounded flex items-center justify-center">
                          <LayoutTemplate className="h-10 w-10 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium">Portfolio</span>
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" /> Browse More Templates
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Website Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="domain">Domain</Label>
                      <div className="flex items-center">
                        <Input
                          id="domain"
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          className="rounded-r-none"
                        />
                        <div className="bg-gray-100 px-3 py-2 border border-l-0 rounded-r-md text-gray-500 text-sm">
                          .vitaacademica.com
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger id="theme">
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto (System)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      className="w-full mt-4"
                      variant="default"
                      onClick={handlePublish}
                      disabled={isPublishing}
                    >
                      {isPublishing ? (
                        <>Publishing...</>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 mr-2" /> Publish Website
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(sections).map(([section, isVisible]) => (
                      <div key={section} className="flex items-center justify-between">
                        <Label htmlFor={`website-section-${section}`} className="capitalize">
                          {section}
                        </Label>
                        <Switch
                          id={`website-section-${section}`}
                          checked={isVisible}
                          onCheckedChange={() => handleSectionToggle(section)}
                        />
                      </div>
                    ))}

                    <Button variant="outline" className="w-full mt-2">
                      <Plus className="h-4 w-4 mr-2" /> Add Custom Section
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle className="text-lg">Website Preview</CardTitle>
                  <div className="flex gap-2">
                    <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" /> View Full Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Website Preview</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 border rounded">
                          <WebsitePreview
                            cvData={cvData}
                            template={selectedTemplate}
                            websiteSettings={{ theme, domain, sections }}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" /> Customize
                    </Button>
                    <Button size="sm" onClick={saveWebsite}>
                      <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="h-[700px] overflow-y-auto">
                  {cvData ? (
                    <WebsitePreview
                      cvData={cvData}
                      template={selectedTemplate}
                      websiteSettings={{ theme, domain, sections }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium">Website Preview</h3>
                        <p className="text-gray-500 text-sm mt-2 max-w-md">
                          Import your CV data to generate a website preview.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WebsiteCustomization;
