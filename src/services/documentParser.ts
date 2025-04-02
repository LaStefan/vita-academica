import { type ParsedCV } from "@/types/parsed-cv";
import { saveAs } from "file-saver";
import { uploadCVFile } from "@/lib/firebase/storage";
import { generateMockCVData } from "@/lib/utils/mockCVData";
import { Document, Packer, HeadingLevel, Paragraph, TextRun } from "docx";
import { generatePDFBlob } from "./pdfGenerator";

// Document metadata type
export interface DocumentMetadata {
  fileName: string;
  fileSize?: string;
  fileType?: string;
  uploadDate?: string;
  lastModified?: string;
  url: string;
}

/**
 * Gets metadata about a document
 * 
 * @param fileUrl The URL of the document
 * @param fileName The name of the document
 * @returns Document metadata
 */
export const getDocumentMetadata = (fileUrl: string, fileName: string): DocumentMetadata => {
  // In a real implementation, this would fetch actual metadata from the file
  const now = new Date();
  
  return {
    fileName: fileName || 'CV Document',
    fileSize: '1.2 MB', // Mock file size
    fileType: fileUrl.split('.').pop()?.toUpperCase() || 'PDF',
    uploadDate: now.toLocaleDateString(),
    lastModified: now.toLocaleDateString(),
    url: fileUrl
  };
};
/**
 * Parses a document file (PDF, DOC, DOCX, TEX) into structured CV data.
 * In this MVP implementation, we upload the file to Firebase Storage 
 * and then return mock data for demonstration purposes.
 * 
 * @param file The document file to parse
 * @param userId The ID of the user who owns the document
 * @returns A promise that resolves to the parsed CV data
 */
export const parseDocument = async (file: File, userId: string = 'anonymous'): Promise<ParsedCV> => {
  try {
    console.log(`Starting to process document: ${file.name} for user: ${userId}`);
    
    // Step 1: Upload the file to Firebase Storage
    const uploadResult = await uploadCVFile(userId, file)
    console.log('File uploaded successfully to:', uploadResult.path);
    
    // Get the download URL
    console.log('File download URL:', uploadResult.url);
    
    // For the MVP, return mock data instead of actually parsing the document
    const mockData = generateMockCVData(userId, uploadResult.path, uploadResult.url);
    
    // Add the actual download URL
    mockData.cvFileUrl = uploadResult.url;
    mockData.cvFilePath = uploadResult.path;
    
    console.log('Generated mock CV data for demonstration');
    
    return mockData;
  } catch (error) {
    console.error("Error in parseDocument:", error);
    throw new Error(`Failed to process the document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
// Helper function to create a Word document
export const createWordDocument = (cvData: ParsedCV, template: string = "classic"): Document => {
  // Create a collection of paragraphs for the document
  const paragraphs = [];
  
  // Create a basic header with personal info
  if (cvData.personalInfo) {
    paragraphs.push(
      new Paragraph({
        text: cvData.personalInfo.name,
        heading: HeadingLevel.TITLE,
        alignment: "center"
      })
    );
    
    if (cvData.personalInfo.title) {
      paragraphs.push(
        new Paragraph({
          text: cvData.personalInfo.title,
          alignment: "center"
        })
      );
    }
    
    const contact = [];
    if (cvData.personalInfo.email) contact.push(cvData.personalInfo.email);
    if (cvData.personalInfo.phone) contact.push(cvData.personalInfo.phone);
    if (cvData.personalInfo.location) contact.push(cvData.personalInfo.location);
    
    if (contact.length > 0) {
      paragraphs.push(
        new Paragraph({
          text: contact.join(" | "),
          alignment: "center"
        })
      );
    }
    
    // Add spacing after the header
    paragraphs.push(new Paragraph(""));
  }
  
  // Add summary section
  if (cvData.summary) {
    paragraphs.push(
      new Paragraph({
        text: "Summary",
        heading: HeadingLevel.HEADING_1
      })
    );
    
    paragraphs.push(new Paragraph(cvData.summary));
    paragraphs.push(new Paragraph(""));
  }
  
  // Add education section
  if (cvData.education && cvData.education.length > 0) {
    paragraphs.push(
      new Paragraph({
        text: "Education",
        heading: HeadingLevel.HEADING_1
      })
    );
    
    cvData.education.forEach(edu => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true }),
            new TextRun({ text: ` (${edu.year})`, bold: false })
          ]
        })
      );
      
      paragraphs.push(new Paragraph(edu.institution));
      
      if (edu.description) {
        paragraphs.push(new Paragraph(edu.description));
      }
      
      paragraphs.push(new Paragraph(""));
    });
  }
  
  // Add experience section
  if (cvData.experience && cvData.experience.length > 0) {
    paragraphs.push(
      new Paragraph({
        text: "Experience",
        heading: HeadingLevel.HEADING_1
      })
    );
    
    cvData.experience.forEach(exp => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.title, bold: true }),
            new TextRun({ text: ` (${exp.period})`, bold: false })
          ]
        })
      );
      
      paragraphs.push(new Paragraph(exp.company));
      paragraphs.push(new Paragraph(exp.description));
      paragraphs.push(new Paragraph(""));
    });
  }
  
  // Add publications section
  if (cvData.publications && cvData.publications.length > 0) {
    paragraphs.push(
      new Paragraph({
        text: "Publications",
        heading: HeadingLevel.HEADING_1
      })
    );
    
    cvData.publications.forEach(pub => {
      paragraphs.push(new Paragraph({ text: pub.title, heading: HeadingLevel.HEADING_2 }));
      paragraphs.push(new Paragraph(pub.authors));
      paragraphs.push(new Paragraph(`${pub.venue}, ${pub.year}`));
      paragraphs.push(new Paragraph(""));
    });
  }
  
  // Create the document with all the content
  return new Document({
    sections: [
      {
        children: paragraphs
      }
    ]
  });
};

// Export function to generate LaTeX code for different templates
export const generateLaTeX = (cvData: ParsedCV, template: string = "classic"): string => {
  // Base LaTeX template that works for all styles
  let latexCode = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\usepackage{hyperref}

\\geometry{margin=1in}
\\hypersetup{colorlinks=true, linkcolor=blue, urlcolor=blue}

\\begin{document}
\\begin{center}
  \\textbf{\\LARGE ${cvData.personalInfo?.name || 'Full Name'}}\\\\
`;

  if (cvData.personalInfo?.title) {
    latexCode += `  \\textit{${cvData.personalInfo.title}}\\\\
`;
  }
  
  // Contact info
  let contactInfo = [];
  if (cvData.personalInfo?.email) contactInfo.push(cvData.personalInfo.email);
  if (cvData.personalInfo?.phone) contactInfo.push(cvData.personalInfo.phone);
  if (cvData.personalInfo?.location) contactInfo.push(cvData.personalInfo.location);
  
  if (contactInfo.length > 0) {
    latexCode += `  ${contactInfo.join(' | ')}
`;
  }
  
  latexCode += `\\end{center}

`;

  // Summary section
  if (cvData.summary) {
    latexCode += `\\section*{${template === 'academic' ? 'Research Interests' : 'Summary'}}
${cvData.summary}

`;
  }

  // Education section
  if (cvData.education && cvData.education.length > 0) {
    latexCode += `\\section*{Education}
`;
    
    cvData.education.forEach(edu => {
      latexCode += `\\textbf{${edu.degree}} \\hfill ${edu.year}\\\\
${edu.institution}
`;
      
      if (edu.description) {
        latexCode += `${edu.description}

`;
      } else {
        latexCode += `

`;
      }
    });
  }

  // Experience section
  if (cvData.experience && cvData.experience.length > 0) {
    latexCode += `\\section*{${template === 'academic' ? 'Professional Experience' : 'Experience'}}
`;
    
    cvData.experience.forEach(exp => {
      latexCode += `\\textbf{${exp.title}} \\hfill ${exp.period}\\\\
${exp.company}\\\\
${exp.description}

`;
    });
  }

  // Publications section 
  if (cvData.publications && cvData.publications.length > 0) {
    latexCode += `\\section*{Publications}
`;
    
    if (template === 'academic') {
      latexCode += `\\begin{enumerate}
`;
      
      cvData.publications.forEach(pub => {
        const authors = pub.authors.replace(/,\s*([^,]+)$/, ' and $1');
        latexCode += `\\item ${authors} (${pub.year}). \\textit{${pub.title}}. ${pub.venue}.
`;
      });
      
      latexCode += `\\end{enumerate}

`;
    } else {
      cvData.publications.forEach(pub => {
        latexCode += `\\textbf{${pub.title}}\\\\
${pub.authors}\\\\
${pub.venue}, ${pub.year}

`;
      });
    }
  }

  // Skills section
  if (cvData.skills && cvData.skills.length > 0) {
    latexCode += `\\section*{Skills}
${cvData.skills.join(', ')}

`;
  }

  // Languages section
  if (cvData.languages && cvData.languages.length > 0) {
    latexCode += `\\section*{Languages}
\\begin{itemize}
`;
    
    cvData.languages.forEach(lang => {
      latexCode += `\\item ${lang.language}: ${lang.proficiency}
`;
    });
    
    latexCode += `\\end{itemize}

`;
  }

  // Achievements
  if (cvData.achievements && cvData.achievements.length > 0) {
    latexCode += `\\section*{Achievements}
\\begin{itemize}
`;
    
    cvData.achievements.forEach(achievement => {
      latexCode += `\\item ${achievement}
`;
    });
    
    latexCode += `\\end{itemize}

`;
  }

  // Custom sections
  if (cvData.customSections && cvData.customSections.length > 0) {
    cvData.customSections.forEach(section => {
      latexCode += `\\section*{${section.title}}
${section.content}

`;
    });
  }

  // End document
  latexCode += `\\end{document}`;
  
  return latexCode;
};

// Export function to handle CV exports
export const exportCV = async (cvData: ParsedCV, format: 'pdf' | 'word' | 'latex' = 'pdf', template: string = 'classic'): Promise<string> => {
  try {
    if (format === 'pdf') {
      // We'll use the react-pdf renderer via the new pdfGenerator service
      const pdfBlob = await generatePDFBlob(cvData, template);
      
      // Create a URL for the blob to download it
      const url = URL.createObjectURL(pdfBlob);
      
      return url;
    } 
    else if (format === 'word') {
      // Create Word document
      const doc = createWordDocument(cvData, template);
      
      // Generate the document as a blob
      const blob = await Packer.toBlob(doc);
      
      // Create object URL for download
      const url = URL.createObjectURL(blob);
      
      return url;
    }
    else if (format === 'latex') {
      // Generate LaTeX code
      const latexCode = generateLaTeX(cvData, template);
      
      // Create a blob with the LaTeX code
      const blob = new Blob([latexCode], { type: 'text/plain' });
      
      // Create object URL for download
      const url = URL.createObjectURL(blob);
      
      return url;
    }
    
    throw new Error(`Unsupported format: ${format}`);
  } catch (error) {
    console.error('Error in exportCV:', error);
    throw new Error('Failed to export CV');
  }
};