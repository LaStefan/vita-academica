
import { toast } from "sonner";

export type ParsedCV = {
  personalInfo?: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    title?: string;
  };
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
    description?: string;
  }>;
  experience?: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
  }>;
  publications?: Array<{
    title: string;
    authors: string;
    venue: string;
    year: string;
    link?: string;
  }>;
  skills?: string[];
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
  achievements?: string[];
};

export type WebsiteTemplate = 'classic' | 'modern' | 'minimal' | 'research';

// This would typically use an AI service to parse the document
export async function parseDocument(file: File): Promise<ParsedCV> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // For now, we'll simulate parsing with a timeout
    // In a real implementation, this would call an API endpoint with OpenAI integration
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success("Document parsed successfully!");
    
    // Return more comprehensive dummy data for demo purposes
    return {
      personalInfo: {
        name: "Dr. Jane Smith",
        email: "jane.smith@university.edu",
        phone: "+1 (555) 123-4567",
        location: "Boston, MA",
        title: "Associate Professor of Computer Science"
      },
      education: [
        {
          degree: "Ph.D. Computer Science",
          institution: "Stanford University",
          year: "2015-2019",
          description: "Thesis: Machine Learning Applications in Healthcare"
        },
        {
          degree: "M.S. Computer Science",
          institution: "MIT",
          year: "2013-2015",
          description: "Focus on Artificial Intelligence"
        },
        {
          degree: "B.S. Computer Science",
          institution: "UC Berkeley",
          year: "2009-2013",
          description: "Minor in Mathematics"
        }
      ],
      experience: [
        {
          title: "Associate Professor",
          company: "Harvard University",
          period: "2020-Present",
          description: "Teaching advanced courses in AI and machine learning. Leading research in natural language processing and computer vision."
        },
        {
          title: "Research Scientist",
          company: "Google AI",
          period: "2019-2020",
          description: "Worked on developing state-of-the-art machine learning models for image recognition and natural language understanding."
        }
      ],
      publications: [
        {
          title: "Advances in Natural Language Processing for Scientific Literature",
          authors: "Smith, J., Johnson, A., Lee, S.",
          venue: "ACM Conference on AI",
          year: "2022",
          link: "https://example.com/publication1"
        },
        {
          title: "Computer Vision Techniques for Medical Image Analysis",
          authors: "Smith, J., Williams, R.",
          venue: "IEEE Transactions on Medical Imaging",
          year: "2021",
          link: "https://example.com/publication2"
        }
      ],
      skills: [
        "Machine Learning",
        "Python",
        "TensorFlow",
        "PyTorch",
        "Computer Vision",
        "Natural Language Processing",
        "Research Methods",
        "Technical Writing"
      ],
      languages: [
        {
          language: "English",
          proficiency: "Native"
        },
        {
          language: "French",
          proficiency: "Professional"
        },
        {
          language: "Spanish",
          proficiency: "Intermediate"
        }
      ],
      achievements: [
        "Best Paper Award, ACM Conference on AI 2022",
        "Research Grant ($500,000), National Science Foundation, 2021",
        "Outstanding Teaching Award, Harvard University, 2021"
      ]
    };
  } catch (error) {
    toast.error("Error parsing document");
    throw error;
  }
}

// Generate website preview based on CV data and selected template
export function generateWebsitePreview(data: ParsedCV, template: WebsiteTemplate): string {
  // In a real implementation, this would generate actual HTML/CSS
  // For demo purposes, we'll return a placeholder URL representing the preview
  return `/previews/${template}-preview.html`;
}

// Export CV to different formats
export async function exportCV(data: ParsedCV, format: 'pdf' | 'word' | 'latex', template?: string): Promise<string> {
  try {
    // Simulate export processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would call a server endpoint to generate the file
    let filename = `cv-${data.personalInfo?.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    switch (format) {
      case 'pdf':
        filename += '.pdf';
        toast.success("CV exported as PDF");
        break;
      case 'word':
        filename += '.docx';
        toast.success("CV exported as Word document");
        break;
      case 'latex':
        filename += '.tex';
        toast.success("CV exported as LaTeX");
        break;
    }
    
    return filename;
  } catch (error) {
    toast.error(`Error exporting to ${format}`);
    throw error;
  }
}

// Publish website based on template and CV data
export async function publishWebsite(data: ParsedCV, template: WebsiteTemplate, domain: string): Promise<string> {
  try {
    // Simulate website generation and publishing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const websiteUrl = `https://${domain}.vitaacademica.com`;
    toast.success("Website published successfully!");
    
    return websiteUrl;
  } catch (error) {
    toast.error("Error publishing website");
    throw error;
  }
}
