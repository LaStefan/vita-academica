
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
  Check,
  RotateCcw,
  Lock
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
import { ref, getDownloadURL } from "firebase/storage";
import { renderToString } from "react-dom/server";
import { functions, storage } from "@/lib/firebase/firebase";
import { httpsCallable } from "firebase/functions";
import WebsiteStatusCard from "@/components/WebsiteStatusCard";
import { WebsiteStatus } from "@/components/WebsiteStatusCard";
import { set } from "date-fns";

// Mock CV data for preview purposes, this should be the specific data of the current user
const mockCVData: ParsedCV = {
  personalInfo: {
    name: "Dr. John Johnson",
    title: "Professor of Computer Science",
    email: "johnjohnson@university.edu",
    phone: "+31 123 456 789",
    location: "Utrecht, UT, Netherlands",
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
      company: "Utrecht University",
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
      authors: "Johnson, J., Johnson, R., Williams, E.",
      venue: "Journal of Artificial Intelligence",
      year: "2023",
      link: "https://example.com/paper1"
    },
    {
      title: "Transformer Models in Academic Publishing",
      authors: "Johnson, J., Brown, A.",
      venue: "Conference on Machine Learning",
      year: "2022"
    }
  ]
};

const WebsiteCustomization = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("academic");
  const [sections, setSections] = useState<Record<string, boolean>>({});
  const [domain, setDomain] = useState("johnjohnson");
  const [theme, setTheme] = useState("light");
  const [cvData, setCvData] = useState<ParsedCV | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [websiteStatus, setWebsiteStatus] = useState<WebsiteStatus>('offline');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<{
    selectedTemplate: string;
    sections: Record<string, boolean>;
  } | null>(null);

  // Load the data avaiable
  useEffect(() => {
    const data = mockCVData;
    setCvData(data);

    const dynamicSections: Record<string, boolean> = {};

    Object.entries(data).forEach(([key, value]) => {
      // If it's an object or array and not empty, we include the section
      const isNonEmpty =
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === 'object' && value !== null && Object.keys(value).length > 0);

      dynamicSections[key] = isNonEmpty;
    });

    setSections(dynamicSections);
  }, []);

  useEffect(() => {
    if (!originalSettings) {
      setIsChanged(false);
      return;
    }

    const hasTemplateChanged = selectedTemplate !== originalSettings.selectedTemplate;
    const hasSectionsChanged =
      JSON.stringify(sections) !== JSON.stringify(originalSettings.sections);

    setIsChanged(hasTemplateChanged || hasSectionsChanged);
  }, [selectedTemplate, sections, originalSettings]);


  const handleSectionToggle = (section: string) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const updateWebsite = async () => {
    if (!domain || !cvData || websiteStatus != 'online') return;

    setIsUpdating(true);

    try {
      const result = await generateAndDeployWebsite({
        domain,
        cvData,
        selectedTemplate,
        sections,
        theme
      });

      if (result.data?.success) {
        toast.success("Website updated successfully!");
      }
      else {
        toast.error("Failed to update website.");
      }
    } catch (error) {
      console.error("Updating failed:", error);
      toast.error("Error updating website.");
    } finally {
      setOriginalSettings({ selectedTemplate, sections });
      setIsChanged(false);
      setIsUpdating(false);
    }

  };

  const handlePublish = async () => {
    setWebsiteStatus('publishing');

    try {
      const result = await generateAndDeployWebsite({
        domain,
        cvData: cvData!,
        selectedTemplate,
        sections,
        theme
      });

      if (result.data?.success) {
        setWebsiteStatus('online');
        toast.success(`Website Published at ${result.data.url}`);
      } else {
        setWebsiteStatus('offline');
        toast.error("Failed to publish.");
      }
    } catch (error) {
      console.error("Publishing failed:", error);
      setWebsiteStatus('offline');
      toast.error("Error publishing website.");
    } finally {
      setOriginalSettings({ selectedTemplate, sections });
      setIsChanged(false);
    }

  };

  const generateAndDeployWebsite = async ({
    domain,
    cvData,
    selectedTemplate,
    sections,
    theme
  }: {
    domain: string;
    cvData: ParsedCV;
    selectedTemplate: string;
    sections: Record<string, boolean>;
    theme: string;
  }) => {
    const styleRef = ref(storage, "websites/styles.css");
    const firebaseCSSURL = await getDownloadURL(styleRef);

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

    type DeployWebsiteResponse = {
      success: boolean;
      url: string;
    };

    const deployWebsite = httpsCallable<unknown, DeployWebsiteResponse>(
      functions,
      "deployWebsite"
    );

    const result = await deployWebsite({
      userId: domain,
      website: websiteHTML,
      metadata: {
        selectedTemplate,
        sections,
        theme,
        domain,
      },
    });

    return result;
  };

  const handleUnpublish = async () => {
    setWebsiteStatus('unpublishing');
    try {

      const minimalPlaceholder = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Site Unavailable</title>
        </head>
        <body>
          <h1 style="text-align: center; margin-top: 20%;">This website has not been published.</h1>
        </body>
        </html>`;

      const unpublishWebsite = httpsCallable(functions, "deployWebsite");

      const result = await unpublishWebsite({
        userId: domain,
        website: minimalPlaceholder,
        metadata: {
          selectedTemplate: "minimal",
          sections: {},
          theme: "light",
          domain,
        },
      });

      if (result.data?.success) {
        toast.success("Website unpublished successfully!");
        setWebsiteStatus('offline');
      } else {
        toast.error("Failed to unpublish.");
        setWebsiteStatus('online');
      }
    } catch (error) {
      console.error("Unpublishing failed:", error);
      setWebsiteStatus('online');
      toast.error("Error unpublishing website.");
    }
    finally {
      setWebsiteStatus('offline');
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
                        className={`border-2 rounded-md p-2 text-center cursor-pointer ${selectedTemplate === 'uu' ? 'border-academic-orange' : 'border-gray-200'}`}
                        onClick={() => setSelectedTemplate('uu')}
                      >
                        <div className="bg-gray-100 h-24 mb-2 rounded flex items-center justify-center">
                          <LayoutTemplate className="h-10 w-10 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium">UU</span>
                      </div>
                    </div>

                    <Button
                      className="w-full text-gray-400 border-gray-300 border-dashed line-through cursor-not-allowed"
                      variant="outline"
                      disabled
                    >
                      <Plus className="h-4 w-4 mr-2" /> Browse More Templates
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <WebsiteStatusCard
                domain={domain}
                status={websiteStatus}
                onToggleStatus={websiteStatus == 'online' ? handleUnpublish : handlePublish}
              />

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

                    <Button
                      className="w-full text-gray-400 border-gray-300 border-dashed line-through cursor-not-allowed"
                      variant="outline"
                      disabled
                    >
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
                  <div className="flex gap-2 items-center">
                    {/* View Full Preview Button */}
                    <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="h-10 px-4">
                          <Eye className="h-4 w-4 mr-2" />
                          View Full Preview
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

                    {/* Update Button */}
                    <Button
                      onClick={updateWebsite}
                      disabled={isUpdating || !isChanged || websiteStatus != 'online'}
                      variant="outline"
                      className="h-10 px-4 transition-opacity flex items-center justify-center"
                    >
                      {isUpdating ? (
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                      ) : websiteStatus != 'online' ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          First publish your website
                        </>
                      ) : !isChanged ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Up to Date
                        </>
                      ) : (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Update
                        </>
                      )}
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
