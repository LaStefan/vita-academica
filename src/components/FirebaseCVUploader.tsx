
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
import { uploadCVFile } from "@/lib/firebase/storage";
import { saveCV, logActivity } from "@/lib/firebase/firestore";
import { useFirebase } from "@/lib/firebase/FirebaseContext";

type ParserStatus = "idle" | "uploading" | "parsing" | "saving" | "success" | "error";

export const FirebaseCVUploader = ({ onParsed }: { onParsed?: (data: ParsedCV) => void }) => {
  const [parsedData, setParsedData] = useState<ParsedCV | null>(null);
  const [status, setStatus] = useState<ParserStatus>("idle");
  const { currentUser } = useFirebase();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!currentUser) {
      toast.error("You must be logged in to upload a CV");
      return;
    }

    try {
      setStatus("uploading");
      toast.info("Uploading document...");
      
      // Upload file to Firebase Storage
      const uploadResult = await uploadCVFile(currentUser.uid, file);
      
      setStatus("parsing");
      toast.info("Analyzing document content...");
      
      // Parse the document content
      const data = await parseDocument(file);
      setParsedData(data);
      
      setStatus("saving");
      toast.info("Saving to your profile...");
      
      // Save CV data to Firestore
      const cvId = await saveCV(currentUser.uid, data);
      
      // Log activity
      await logActivity(currentUser.uid, {
        type: "upload",
        title: "CV Uploaded",
        description: `You uploaded ${file.name}`,
        icon: null
      });
      
      setStatus("success");
      toast.success("CV successfully parsed and saved");
      
      // Call the callback if provided
      if (onParsed) {
        onParsed(data);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setStatus("error");
      toast.error("Failed to process document");
    }
  };

  const renderStatusIndicator = () => {
    switch (status) {
      case "uploading":
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Uploading to secure storage...</span>
          </div>
        );
      case "parsing":
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing document content...</span>
          </div>
        );
      case "saving":
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Saving to your profile...</span>
          </div>
        );
      case "success":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Document processed successfully</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>Error processing document</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Import CV with Firebase</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <label 
              htmlFor="firebase-cv-upload"
              className="cursor-pointer flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 mb-1">Upload your CV to Firebase</span>
              <span className="text-xs text-gray-400">Secure cloud storage for your documents</span>
              <input
                id="firebase-cv-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.tex"
                onChange={handleFileUpload}
                disabled={status === "uploading" || status === "parsing" || status === "saving"}
              />
            </label>
          </div>
          
          <div className="text-center">
            {renderStatusIndicator()}
          </div>
          
          {status === "success" && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-center text-green-700 font-medium">
                Your CV has been uploaded to Firebase and is now available in your account.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
