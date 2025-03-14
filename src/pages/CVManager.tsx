import React, { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { CVParser } from "@/components/CVParser";
import CVExporter from "@/components/CVExporter";
import CVPreview from "@/components/CVPreview";
import { ParsedCV } from "@/services/documentParser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CVManager = () => {
  const [cvData, setCvData] = useState<ParsedCV | null>(null);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState({
    education: true,
    experience: true,
    achievements: true,
    publications: true,
    skills: true,
    languages: true,
    references: false
  });

  useEffect(() => {
    // Simulate loading mock data
    const loadMockData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock CV data - adjusted to match ParsedCV type
      const mockCV: ParsedCV = {
        personalInfo: {
          name: "Dr. Jane Smith",
          title: "Associate Professor of Computer Science",
          email: "jane.smith@university.edu",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
        },
        education: [
          {
            degree: "Ph.D. in Computer Science",
            institution: "Stanford University",
            year: "2010-2015",
            description: "Thesis: 'Deep Learning Approaches to Natural Language Understanding'",
          },
          {
            degree: "M.S. in Computer Science",
            institution: "University of California, Berkeley",
            year: "2008-2010",
            description: "Specialization in Artificial Intelligence",
          }
        ],
        experience: [
          {
            title: "Associate Professor",
            company: "University of California, San Francisco",
            period: "2020-Present",
            description: "Teaching graduate courses in machine learning and AI. Leading research group focused on healthcare applications of AI.",
          },
          {
            title: "Assistant Professor",
            company: "University of Washington",
            period: "2015-2020",
            description: "Taught undergraduate and graduate courses. Published 15+ research papers in top-tier conferences.",
          }
        ],
        publications: [
          {
            title: "Advances in Neural Networks for Medical Imaging Analysis",
            authors: "Smith, J., Johnson, A., Williams, B.",
            venue: "Journal of Artificial Intelligence in Medicine",
            year: "2022",
            link: "https://doi.org/10.1234/jaim.2022.123",
          },
          {
            title: "Transformer Architectures for Biomedical Text Mining",
            authors: "Smith, J., Davis, R.",
            venue: "Proceedings of ACL 2021",
            year: "2021",
            link: "https://doi.org/10.5678/acl.2021.456",
          }
        ],
        skills: [
          "Machine Learning",
          "Deep Learning",
          "Python",
          "TensorFlow/PyTorch",
          "Natural Language Processing",
          "Research Methodology"
        ],
        languages: [
          {
            language: "English",
            proficiency: "Native"
          },
          {
            language: "Spanish",
            proficiency: "Intermediate"
          },
          {
            language: "French",
            proficiency: "Basic"
          }
        ],
        achievements: [
          "ACM SIGAI Outstanding Early Career Award (2019)",
          "Best Paper Award, NeurIPS (2018)"
        ],
      };
      
      setCvData(mockCV);
      setLoading(false);
    };
    
    loadMockData();
  }, []);

  const handleSectionToggle = (section: string) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const handleCVParsed = (data: ParsedCV) => {
    setCvData(data);
  };

  const handleCVUpdate = (updatedData: ParsedCV) => {
    setCvData(updatedData);
    toast.success("CV updated successfully");
  };

  const handleExport = async (format: string) => {
    toast.success(`CV exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="flex min-h-screen bg-academic-light">
      <DashboardSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">CV Manager</h1>
            <p className="text-gray-600">Edit, customize and export your CV</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-academic-orange" />
              <span className="ml-2 text-academic-orange">Loading your CV data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                {/* Only show the regular parser, removed Firebase uploader */}
                <div className="mb-6">
                  <CVParser onParsed={handleCVParsed} />
                </div>
              </div>

              {cvData && (
                <>
                  <div className="lg:col-span-1 space-y-6">
                    <CVExporter 
                      cvData={cvData}
                      onExport={handleExport}
                    />
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Sections</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(sections).map(([section, isVisible]) => (
                            <div key={section} className="flex items-center justify-between">
                              <Label htmlFor={`section-${section}`} className="capitalize">
                                {section}
                              </Label>
                              <Switch 
                                id={`section-${section}`}
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
                    <CVPreview cvData={cvData} onCVUpdate={handleCVUpdate} />
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
