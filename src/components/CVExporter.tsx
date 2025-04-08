import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Download,
  Loader2,
  LayoutTemplate,
  File,
  FileType,
  Printer,
} from 'lucide-react';
import { type ParsedCV } from '@/types/parsed-cv';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { saveAs } from 'file-saver';
import { Packer } from 'docx';
import { createWordDocument, generateLaTeX } from '@/services/documentParser';
import { CVPDFPreview, generatePDFBlob } from '@/services/pdfGenerator';
import { FaFileAlt, FaFilePdf, FaFileWord } from 'react-icons/fa';

type CVExporterProps = {
  cvData: ParsedCV | null;
  onExport?: (format: string) => Promise<void>;
  visibleSections?: Record<string, boolean>;
};

const CVExporter: React.FC<CVExporterProps> = ({
  cvData,
  onExport,
  visibleSections = {},
}) => {
  const [format, setFormat] = useState<'pdf' | 'word' | 'latex'>('pdf');
  const [template, setTemplate] = useState<string>('classic');
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isDisabledTemplate, setDisabledTemplate] = useState(false);

  const handleExport = async () => {
    if (!cvData) {
      toast.error('No CV data available to export');
      return;
    }

    try {
      setIsExporting(true);

      // Generate the filename based on the user's name and template
      const userName = cvData.personalInfo?.name?.replace(/\s+/g, '_') || 'CV';
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .substring(0, 16);
      const fileName = `${userName}_${template}_${timestamp}`;

      if (format === 'pdf') {
        // Use our PDF generation passing the visible sections
        const pdfBlob = await generatePDFBlob(
          cvData,
          template,
          visibleSections
        );
        saveAs(pdfBlob, `${fileName}.pdf`);
      } else if (format === 'word') {
        // Create Word document with template and visibleSections
        const doc = createWordDocument(cvData, template);
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${fileName}.docx`);
      } else if (format === 'latex') {
        // Generate LaTeX with template and visibleSections
        const latexCode = generateLaTeX(cvData, template);
        const blob = new Blob([latexCode], { type: 'text/plain' });
        saveAs(blob, `${fileName}.tex`);
      }

      // if (onExport) {
      //   await onExport(format);
      // }

      toast.success(`CV exported as ${format.toUpperCase()}`, {
        description: 'Your file has been downloaded',
      });
    } catch (error) {
      console.error(`Error exporting to ${format}:`, error);
      toast.error(`Failed to export CV as ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  const renderPreview = () => {
    return (
      <div className='bg-white border rounded p-4 min-h-[300px] max-h-[600px] overflow-y-auto'>
        {format === 'pdf' && (
          <div className='h-[500px]'>
            {cvData && (
              <CVPDFPreview
                cvData={cvData}
                template={template}
                visibleSections={visibleSections}
              />
            )}
          </div>
        )}

        {format === 'word' && renderWordPreview()}

        {format === 'latex' && (
          <div className='font-mono text-xs bg-gray-50 p-4'>
            <pre className='whitespace-pre-wrap'>{renderLaTeXPreview()}</pre>
          </div>
        )}
      </div>
    );
  };

  const renderWordPreview = () => {
    return (
      <div className='space-y-4 font-sans'>
        {cvData?.summary && (
          <div>
            <h2 className='text-xl font-bold border-b border-gray-300 mb-2'>
              Summary
            </h2>
            <p>{cvData.summary}</p>
          </div>
        )}

        {cvData?.education && cvData.education.length > 0 && (
          <div>
            <h2 className='text-xl font-bold border-b border-gray-300 mb-2'>
              Education
            </h2>
            {cvData.education.map((edu, idx) => (
              <div key={idx} className='mb-3'>
                <p className='font-bold'>
                  {edu.degree} <span className='font-normal'>({edu.year})</span>
                </p>
                <p>{edu.institution}</p>
                {edu.description && <p>{edu.description}</p>}
              </div>
            ))}
          </div>
        )}

        {cvData?.experience && cvData.experience.length > 0 && (
          <div>
            <h2 className='text-xl font-bold border-b border-gray-300 mb-2'>
              Experience
            </h2>
            {cvData.experience.map((exp, idx) => (
              <div key={idx} className='mb-3'>
                <p className='font-bold'>
                  {exp.title}{' '}
                  <span className='font-normal'>({exp.period})</span>
                </p>
                <p>{exp.company}</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {cvData?.publications && cvData.publications.length > 0 && (
          <div>
            <h2 className='text-xl font-bold border-b border-gray-300 mb-2'>
              Publications
            </h2>
            {cvData.publications.map((pub, idx) => (
              <div key={idx} className='mb-3'>
                <p className='font-bold'>{pub.title}</p>
                <p>{pub.authors}</p>
                <p>
                  {pub.venue}, {pub.year}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderLaTeXPreview = () => {
    const getTemplateSnippet = () => {
      if (template === 'modern') {
        return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{titlesec}

\\geometry{margin=0.75in}
\\hypersetup{colorlinks=true, linkcolor=blue, urlcolor=blue}
\\definecolor{sectioncolor}{RGB}{52,73,94}

\\titleformat{\\section}{\\Large\\bfseries\\color{sectioncolor}}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{12pt}{6pt}

\\begin{document}
\\begin{center}
  \\textbf{\\LARGE ${cvData?.personalInfo?.name || 'Full Name'}}\\\\
  ${cvData?.personalInfo?.title
            ? `\\textit{${cvData.personalInfo.title}}\\\\`
            : ''
          }
  ${cvData?.personalInfo?.email || ''}
  ${cvData?.personalInfo?.phone ? ` | ${cvData.personalInfo.phone}` : ''}
\\end{center}

\\section{SUMMARY}
${cvData?.summary || 'Professional summary goes here.'}

\\section{EDUCATION}
\\textbf{${cvData?.education?.[0]?.degree || 'Degree'}} \\hfill ${cvData?.education?.[0]?.year || 'Year'
          }\\\\
${cvData?.education?.[0]?.institution || 'Institution'}

\\section{EXPERIENCE}
\\textbf{${cvData?.experience?.[0]?.title || 'Job Title'}} \\hfill ${cvData?.experience?.[0]?.period || 'Period'
          }\\\\
${cvData?.experience?.[0]?.company || 'Company'}\\\\
${cvData?.experience?.[0]?.description || 'Job description.'}

\\end{document}`;
      } else if (template === 'academic') {
        return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\usepackage{hyperref}
\\usepackage{sectsty}

\\geometry{margin=1in}
\\hypersetup{colorlinks=true, linkcolor=blue, urlcolor=blue}
\\sectionfont{\\normalfont\\scshape}

\\begin{document}
\\begin{center}
  \\textbf{\\LARGE ${cvData?.personalInfo?.name || 'Full Name'}}\\\\
  ${cvData?.personalInfo?.title
            ? `\\textit{${cvData.personalInfo.title}}\\\\`
            : ''
          }
  ${cvData?.personalInfo?.email || ''}
  ${cvData?.personalInfo?.phone ? ` | ${cvData.personalInfo.phone}` : ''}
\\end{center}

\\section*{Publications}
\\begin{enumerate}
${cvData?.publications?.[0]
            ? `\\item ${cvData.publications[0].authors.replace(
              /,\\s*([^,]+)$/,
              ' and $1'
            )} (${cvData.publications[0].year}). \\textit{${cvData.publications[0].title
            }}. ${cvData.publications[0].venue}.`
            : '\\item Authors (Year). \\textit{Title}. Venue.'
          }
\\end{enumerate}

\\section*{Education}
\\textbf{${cvData?.education?.[0]?.degree || 'Degree'}} \\hfill ${cvData?.education?.[0]?.year || 'Year'
          }\\\\
${cvData?.education?.[0]?.institution || 'Institution'}

\\section*{Research Interests}
${cvData?.summary || 'Research interests summary goes here.'}

\\end{document}`;
      } else if (template === 'minimalist') {
        return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\usepackage{hyperref}
\\usepackage{titlesec}

\\geometry{margin=1in}
\\hypersetup{colorlinks=true, linkcolor=black, urlcolor=black}

\\titleformat{\\section}{\\normalfont\\bfseries}{}{0em}{}[\\titlerule[0.3pt]]
\\titlespacing{\\section}{0pt}{8pt}{3pt}

\\begin{document}
\\begin{center}
  \\textbf{\\large ${cvData?.personalInfo?.name || 'FULL NAME'}}\\\\
  ${cvData?.personalInfo?.title ? `${cvData.personalInfo.title}\\\\` : ''}
  ${cvData?.personalInfo?.email || ''} · ${cvData?.personalInfo?.phone || ''}
\\end{center}

\\section*{PROFILE}
${cvData?.summary || 'Professional profile goes here.'}

\\section*{EXPERIENCE}
\\textbf{${cvData?.experience?.[0]?.title || 'Job Title'}} \\hfill ${cvData?.experience?.[0]?.period || 'Period'
          }\\\\
${cvData?.experience?.[0]?.company || 'Company'}\\\\
${cvData?.experience?.[0]?.description || 'Job description.'}

\\section*{EDUCATION}
\\textbf{${cvData?.education?.[0]?.degree || 'Degree'}} \\hfill ${cvData?.education?.[0]?.year || 'Year'
          }\\\\
${cvData?.education?.[0]?.institution || 'Institution'}

\\end{document}`;
      } else {
        return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\usepackage{hyperref}

\\geometry{margin=1in}
\\hypersetup{colorlinks=true, linkcolor=blue, urlcolor=blue}

\\begin{document}
\\begin{center}
  \\textbf{\\LARGE ${cvData?.personalInfo?.name || 'Full Name'}}\\\\
  ${cvData?.personalInfo?.title
            ? `\\textit{${cvData.personalInfo.title}}\\\\`
            : ''
          }
  ${cvData?.personalInfo?.email || ''}
  ${cvData?.personalInfo?.phone ? ` | ${cvData.personalInfo.phone}` : ''}
\\end{center}

\\section*{Summary}
${cvData?.summary || 'Professional summary goes here.'}

\\section*{Education}
\\textbf{${cvData?.education?.[0]?.degree || 'Degree'}} \\hfill ${cvData?.education?.[0]?.year || 'Year'
          }\\\\
${cvData?.education?.[0]?.institution || 'Institution'}
${cvData?.education?.[0]?.description
            ? `\\\\${cvData.education[0].description}`
            : ''
          }

\\section*{Experience}
\\textbf{${cvData?.experience?.[0]?.title || 'Job Title'}} \\hfill ${cvData?.experience?.[0]?.period || 'Period'
          }\\\\
${cvData?.experience?.[0]?.company || 'Company'}\\\\
${cvData?.experience?.[0]?.description || 'Job description.'}

\\end{document}`;
      }
    };

    return getTemplateSnippet();
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
            <TabsTrigger
              value='pdf'
              className='flex items-center gap-2'
              onClick={() => setDisabledTemplate(false)}>
              <FaFilePdf className='h-4 w-4' /> PDF
            </TabsTrigger>
            <TabsTrigger
              value='word'
              className='flex items-center gap-2'
              onClick={() => setDisabledTemplate(false)}>
              <FaFileWord className='h-4 w-4' /> Word
            </TabsTrigger>
            <TabsTrigger
              value='latex'
              className='flex items-center gap-2'
              onClick={() => setDisabledTemplate(true)}>
              <FaFileAlt className='h-4 w-4' /> LaTeX
            </TabsTrigger>
          </TabsList>

          <div className='mb-4'>
            <label className='text-sm text-gray-500 mb-2 block'>
              CV Template
            </label>
            <Select
              value={template}
              onValueChange={setTemplate}
              disabled={isDisabledTemplate}>
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
              <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle>
                    {format.toUpperCase()} Preview -{' '}
                    {template.charAt(0).toUpperCase() + template.slice(1)}{' '}
                    Template
                  </DialogTitle>
                </DialogHeader>
                {showPreview && renderPreview()}
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
