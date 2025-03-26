import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileType2,
  FileType,
  FileText,
  Download,
  Loader2,
  LayoutTemplate,
} from 'lucide-react';
import { exportCV } from '@/services/documentParser';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ParsedCV } from '@/types/parsed-cv';

type CVExporterProps = {
  cvData: ParsedCV | null;
  onExport?: (format: string) => Promise<void>;
};

const CVExporter: React.FC<CVExporterProps> = ({ cvData, onExport }) => {
  const [format, setFormat] = useState<'pdf' | 'word' | 'latex'>('pdf');
  const [template, setTemplate] = useState<string>('classic');
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleExport = async () => {
    if (!cvData) return;

    try {
      setIsExporting(true);
      // Export CV using Firebase Cloud Function
      const exportedFileUrl = await exportCV(cvData, format, template);

      // Open the exported file in a new window or download it
      if (exportedFileUrl.startsWith('http')) {
        window.open(exportedFileUrl, '_blank');
      }

      // Call the onExport prop if provided
      if (onExport) {
        await onExport(format);
      }

      toast.success(`CV successfully exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error(`Error exporting to ${format}:`, error);
      toast.error(`Failed to export CV as ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  const renderPreview = () => {
    // In a real app, this would render an actual preview based on the format and template
    return (
      <div className='bg-white border rounded p-4 min-h-[300px] max-h-[600px] overflow-y-auto'>
        {format === 'pdf' && (
          <div className='space-y-4'>
            <div className='text-center py-4 border-b'>
              <h1 className='text-2xl font-bold'>
                {cvData?.personalInfo?.name || 'Full Name'}
              </h1>
              <p className='text-gray-600'>
                {cvData?.personalInfo?.title || 'Position Title'}
              </p>
              <div className='flex justify-center space-x-3 mt-2 text-sm'>
                <span>
                  {cvData?.personalInfo?.email || 'email@example.com'}
                </span>
                <span>{cvData?.personalInfo?.phone || '+1 234 567 890'}</span>
              </div>
            </div>

            {/* Education Section */}
            {cvData?.education && cvData.education.length > 0 && (
              <div>
                <h2 className='text-lg font-bold border-b mb-2'>Education</h2>
                {cvData.education.map((edu, idx) => (
                  <div key={idx} className='mb-2'>
                    <div className='flex justify-between'>
                      <strong>{edu.degree}</strong>
                      <span>{edu.year}</span>
                    </div>
                    <p>{edu.institution}</p>
                    {edu.description && (
                      <p className='text-sm'>{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Experience Section */}
            {cvData?.experience && cvData.experience.length > 0 && (
              <div>
                <h2 className='text-lg font-bold border-b mb-2'>Experience</h2>
                {cvData.experience.map((exp, idx) => (
                  <div key={idx} className='mb-2'>
                    <div className='flex justify-between'>
                      <strong>{exp.title}</strong>
                      <span>{exp.period}</span>
                    </div>
                    <p>{exp.company}</p>
                    <p className='text-sm'>{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Publications Section */}
            {cvData?.publications && cvData.publications.length > 0 && (
              <div>
                <h2 className='text-lg font-bold border-b mb-2'>
                  Publications
                </h2>
                {cvData.publications.map((pub, idx) => (
                  <div key={idx} className='mb-2 text-sm'>
                    <p>
                      <strong>{pub.title}</strong>
                    </p>
                    <p>{pub.authors}</p>
                    <p>
                      {pub.venue}, {pub.year}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {format === 'word' && (
          <div className='space-y-4'>
            <div className='text-center py-4'>
              <h1 className='text-2xl font-bold'>
                {cvData?.personalInfo?.name || 'Full Name'}
              </h1>
              <p className='text-gray-600'>
                {cvData?.personalInfo?.title || 'Position Title'}
              </p>
              <div className='flex justify-center space-x-3 mt-2 text-sm'>
                <span>
                  {cvData?.personalInfo?.email || 'email@example.com'}
                </span>
                <span>{cvData?.personalInfo?.phone || '+1 234 567 890'}</span>
              </div>
            </div>

            {/* Word format - similar but with slightly different styling */}
            {/* Education, Experience, Publications sections similar to PDF but with Word styling */}
            <p className='text-center text-gray-500'>Word document preview</p>
          </div>
        )}

        {format === 'latex' && (
          <div className='font-mono text-xs bg-gray-50 p-4'>
            <pre>{`\\documentclass{article}
\\usepackage{hyperref}
\\begin{document}

\\title{Curriculum Vitae}
\\author{${cvData?.personalInfo?.name || 'Full Name'}}
\\date{\\today}
\\maketitle

\\section{Personal Information}
\\begin{itemize}
  \\item Email: ${cvData?.personalInfo?.email || 'email@example.com'}
  \\item Phone: ${cvData?.personalInfo?.phone || '+1 234 567 890'}
  \\item Title: ${cvData?.personalInfo?.title || 'Position Title'}
\\end{itemize}

\\section{Education}
${
  cvData?.education
    ?.map(
      (edu) => `\\subsection{${edu.institution}}
\\textbf{${edu.degree}} \\hfill ${edu.year}
${edu.description ? `\n${edu.description}` : ''}`
    )
    .join('\n\n') || '\\textit{No education entries}'
}

\\section{Experience}
${
  cvData?.experience
    ?.map(
      (exp) => `\\subsection{${exp.company}}
\\textbf{${exp.title}} \\hfill ${exp.period}
${exp.description}`
    )
    .join('\n\n') || '\\textit{No experience entries}'
}

\\section{Publications}
${
  cvData?.publications
    ?.map(
      (pub) => `\\begin{itemize}
  \\item ${pub.authors}. \\textit{${pub.title}}. ${pub.venue}, ${pub.year}.
\\end{itemize}`
    )
    .join('\n') || '\\textit{No publications}'
}

\\end{document}`}</pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Export Format</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue='pdf'
          value={format}
          onValueChange={(value) =>
            setFormat(value as 'pdf' | 'word' | 'latex')
          }>
          <TabsList className='grid grid-cols-3 mb-4'>
            <TabsTrigger value='pdf' className='flex items-center gap-2'>
              <FileType2 className='h-4 w-4' /> PDF
            </TabsTrigger>
            <TabsTrigger value='word' className='flex items-center gap-2'>
              <FileType className='h-4 w-4' /> Word
            </TabsTrigger>
            <TabsTrigger value='latex' className='flex items-center gap-2'>
              <FileText className='h-3 w-3' /> LaTeX
            </TabsTrigger>
          </TabsList>

          <div className='mb-4'>
            <label className='text-sm text-gray-500 mb-2 block'>
              CV Template
            </label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger>
                <SelectValue placeholder='Select template' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='classic'>Classic</SelectItem>
                <SelectItem value='modern'>Modern</SelectItem>
                <SelectItem value='academic'>Academic</SelectItem>
                <SelectItem value='minimalist'>Minimalist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex gap-2'>
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button variant='outline' className='flex-1' disabled={!cvData}>
                  <LayoutTemplate className='h-4 w-4 mr-2' /> Preview
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-3xl max-h-[80vh] overflow-y-auto'>
                <h2 className='text-xl font-bold mb-4'>
                  {format.toUpperCase()} Preview -{' '}
                  {template.charAt(0).toUpperCase() + template.slice(1)}{' '}
                  Template
                </h2>
                {renderPreview()}
              </DialogContent>
            </Dialog>

            <Button
              className='flex-1'
              onClick={handleExport}
              disabled={isExporting || !cvData}>
              {isExporting ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' /> Exporting...
                </>
              ) : (
                <>
                  <Download className='h-4 w-4 mr-2' /> Export
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CVExporter;
