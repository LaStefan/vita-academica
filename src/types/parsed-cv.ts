// Types for the parsed CV data
export interface ParsedCV {
  personalInfo?: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    title?: string;
  };
  summary?: string;
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
  references?: Array<{
    name: string;
    title: string;
    institution: string;
    contact: string;
  }>;
  skills?: string[];
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
  achievements?: string[];
  other?: Record<string, any>;
  cvFilePath?: string;
  cvFileUrl?: string;
}