
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Eye, FileText } from "lucide-react";
import { toast } from "sonner";

type ActivityType = "upload" | "download" | "edit" | "share" | "website";

interface DocumentHistoryItemProps {
  id: number;
  type: ActivityType;
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
}

const DocumentHistoryItem: React.FC<DocumentHistoryItemProps> = ({
  id,
  type,
  title,
  description,
  date,
  icon
}) => {
  const handleDownload = () => {
    toast.success(`Started download: ${title}`);
  };

  const handlePreview = () => {
    // In a real app, this would open a preview of the document
    toast.info(`Previewing: ${title}`);
  };

  // Only show document actions for upload and download types
  const showDocumentActions = type === "upload" || type === "download";

  return (
    <div className="relative pl-14">
      {/* Timeline dot */}
      <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
        <div className="absolute -left-3 -top-3 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      <Card className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <span className="text-xs text-gray-400">{date}</span>
        </div>
        
        {showDocumentActions && (
          <div className="mt-2 pt-2 border-t border-gray-100 flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Document Preview</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-10 border rounded-md bg-gray-50">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-center text-gray-600">
                    {title}
                    <br/>
                    <span className="text-sm text-gray-400">Preview would be displayed here</span>
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center gap-1"
              onClick={handleDownload}
            >
              <Download className="h-3 w-3" />
              Download
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DocumentHistoryItem;
