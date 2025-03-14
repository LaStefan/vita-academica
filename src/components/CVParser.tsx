import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import { parseDocument, type ParsedCV } from "@/services/documentParser";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ParserStatus = "idle" | "uploading" | "parsing" | "success" | "error";

export const CVParser = ({ onParsed }: { onParsed?: (data: ParsedCV) => void }) => {
  const [parsedData, setParsedData] = useState<ParsedCV | null>(null);
  const [status, setStatus] = useState<ParserStatus>("idle");
  const [activeTab, setActiveTab] = useState("upload");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setStatus("uploading");
      toast.info("Uploading document...");
      
      // Simulate a brief upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStatus("parsing");
      toast.info("Analyzing document content...");
      
      const data = await parseDocument(file);
      setParsedData(data);
      setStatus("success");
      setActiveTab("preview");
      
      // Call the callback if provided
      if (onParsed) {
        onParsed(data);
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      setStatus("error");
      toast.error("Failed to parse document");
    }
  };

  const renderStatusIndicator = () => {
    switch (status) {
      case "uploading":
      case "parsing":
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{status === "uploading" ? "Uploading..." : "Parsing document..."}</span>
          </div>
        );
      case "success":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Document parsed successfully</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>Error parsing document</span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPreview = () => {
    if (!parsedData) return null;

    return (
      <div className="space-y-6">
        {parsedData.personalInfo && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg border-b pb-2 mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="font-semibold text-xl">{parsedData.personalInfo.name}</p>
                <p className="text-gray-600">{parsedData.personalInfo.title}</p>
              </div>
              <div className="text-right">
                <p>{parsedData.personalInfo.email}</p>
                {parsedData.personalInfo.phone && <p>{parsedData.personalInfo.phone}</p>}
                {parsedData.personalInfo.location && <p>{parsedData.personalInfo.location}</p>}
              </div>
            </div>
          </div>
        )}

        {parsedData.education && parsedData.education.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg border-b pb-2 mb-3">Education</h3>
            <div className="space-y-4">
              {parsedData.education.map((edu, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="md:col-span-2">
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-gray-600">{edu.institution}</p>
                    {edu.description && <p className="text-sm text-gray-500 mt-1">{edu.description}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {parsedData.experience && parsedData.experience.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg border-b pb-2 mb-3">Experience</h3>
            <div className="space-y-4">
              {parsedData.experience.map((exp, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="md:col-span-2">
                    <p className="font-medium">{exp.title}</p>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500 mt-1">{exp.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{exp.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other sections like publications, skills, etc. would be rendered here */}
        
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setActiveTab("upload")}>
            Upload Another
          </Button>
          <Button 
            onClick={() => {
              // This would typically integrate with the parent component
              toast.success("CV content saved to your profile");
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Save Content
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Import CV</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="upload">Upload Document</TabsTrigger>
            <TabsTrigger value="preview" disabled={!parsedData}>Preview Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="flex justify-center">
              <label 
                htmlFor="cv-upload"
                className="cursor-pointer flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500 mb-1">Upload your CV</span>
                <span className="text-xs text-gray-400">Supported formats: PDF, Word, or LaTeX</span>
                <input
                  id="cv-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.tex"
                  onChange={handleFileUpload}
                  disabled={status === "uploading" || status === "parsing"}
                />
              </label>
            </div>
            
            <div className="text-center">
              {renderStatusIndicator()}
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            {renderPreview()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
