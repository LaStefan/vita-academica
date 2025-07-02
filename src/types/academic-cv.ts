export interface AcademicCV {
  personalInfo: {
    name: string;
    birthdate?: string;
    email?: string;
    phone?: string;
    website?: string;
    orcid?: string;
  };
  summary?: string;
  education: {
    institution: string;
    degree: string;
    startDate?: string;
    endDate?: string;
    thesisTitle?: string;
  }[];
  employment: {
    position: string;
    institution: string;
    location?: string;
    startDate?: string;
    endDate?: string | null;
  }[];
  visitingPositions?: {
    position: string;
    institution: string;
    location?: string;
    year?: number;
  }[];
  grants?: {
    title: string;
    amount?: string;
    date?: string;
    fundingAgency?: string;
  }[];
  coursesTaught?: {
    name: string;
    level?: string;
    institution?: string;
    startYear?: number;
  }[];
  publications?: {
    title: string;
    journal?: string;
    year?: number;
    authors?: string[];
  }[];
  awards?: {
    title: string;
    organization?: string;
    year?: number;
  }[];
}