/**
 * Represents a parsed CV with all its sections
 */
export interface ParsedCV {
  /**
   * Personal information of the CV owner
   */
  personalInfo?: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    title?: string;
    image?: string;
  };

  /**
   * Professional summary or objective statement
   */
  summary?: string;

  /**
   * Education history entries
   */
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
    description?: string;
  }>;

  /**
   * Work experience entries
   */
  experience?: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
  }>;

  /**
   * Academic or professional publications
   */
  publications?: Array<{
    title: string;
    authors: string;
    venue: string;
    year: string;
    link?: string;
  }>;

  /**
   * Professional skills
   */
  skills?: string[];

  /**
   * Language proficiencies
   */
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;

  /**
   * Notable achievements or awards
   */
  achievements?: string[];

  /**
   * Professional references
   */
  references?: Array<{
    name: string;
    title: string;
    institution: string;
    contact: string;
  }>;

  /**
   * Custom sections added by the user
   */
  customSections?: Array<{
    id: string;
    title: string;
    content: string;
  }>;


  /**
   * Path to the uploaded CV file
   */
  cvFilePath?: string;

  /**
   * URL to access the CV file
   */
  cvFileUrl?: string;

  /**
   * Document ID in Firestore (if saved)
   */
  id?: string;
}