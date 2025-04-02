import { ParsedCV } from "@/types/parsed-cv";

/**
 * Generates mock CV data for Dr. Slinger Jansen
 */
export const generateMockCVData = (userId: string, fileName?: string, url?: string): ParsedCV => {
  return {
    personalInfo: {
      name: "Dr. Slinger Jansen",
      email: "slinger.jansen@example.com",
      phone: "+31 612345678",
      location: "Utrecht, Netherlands",
      title: "Associate Professor of Information Sciences"
    },
    summary: "Academic with a passion for empirical software engineering research within software ecosystems. My work focuses on the more technical aspects of managing software ecosystems, such as health measurements of open source communities, understanding trust in software, and analyzing (research) software engineering communities.",
    education: [
      {
        degree: "PhD in Computer Science",
        institution: "Utrecht University & CWI",
        year: "2003-2007",
        description: "Dissertation: Customer Configuration Updating in a Software Supply Network"
      },
      {
        degree: "MSc in Computer Science",
        institution: "Leiden University",
        year: "1998-2003",
        description: "Thesis: Paradigm: Mobile Dining Philosophers"
      }
    ],
    experience: [
      {
        title: "Associate Professor",
        company: "Utrecht University",
        period: "2007-Present",
        description: "Leader of the Software Ecosystems Security Research Group. Supervising assistant professors, PhD students, and graduate students."
      },
      {
        title: "Visiting Adjunct Professor",
        company: "Lappeenranta University of Technology",
        period: "2021-Present",
        description: "Software Engineering Department led by Prof. dr. Kari Smȯlander"
      },
      {
        title: "Visiting Senior Researcher",
        company: "Centrum Wiskunde en Informatica",
        period: "2020-2022",
        description: "Software Analysis and Transformation group led by Jurgen Vinju"
      }
    ],
    publications: [
      {
        title: "A Survey of the State-of-the-Art Approaches for Evaluating Trust in Software Ecosystems",
        authors: "Fang Hou and Slinger Jansen",
        venue: "Journal of Software: Evolution and Process",
        year: "2024",
        link: "https://example.com/publication1"
      },
      {
        title: "A systematic literature review on trust in the software ecosystem",
        authors: "Fang Hou and Slinger Jansen",
        venue: "Empirical Software Engineering",
        year: "2023",
        link: "https://example.com/publication2"
      },
      {
        title: "API-m-FAMM: A Focus Area Maturity Model for API Management",
        authors: "Michiel Overeem, Max Mathijssen, and Slinger Jansen",
        venue: "Information and Software Technology",
        year: "2022",
        link: "https://example.com/publication3"
      }
    ],
    skills: [
      "Software Ecosystems",
      "Empirical Software Engineering",
      "Software Architecture",
      "Research Methods",
      "Software Business",
      "Academic Writing",
      "Software Security"
    ],
    languages: [
      {
        language: "English",
        proficiency: "Fluent"
      },
      {
        language: "Dutch",
        proficiency: "Native"
      }
    ],
    achievements: [
      "10 year achievement award at International Conference on Software Business 2019",
      "Best paper Award ICEIS 2017",
      "Associate Editor for the Empirical Software Engineering Journal",
      "Obtained h-index of 43",
      "Attracted 3.1M Euro in research funding"
    ],
    references: [
      {
        name: "Prof. dr. Jan Bosch",
        title: "Professor in Software Engineering",
        institution: "Chalmers University of Technology",
        contact: "jan.bosch@chalmers.se"
      },
      {
        name: "Prof. dr. Sjaak Brinkkemper",
        title: "Professor",
        institution: "Utrecht University",
        contact: "s.brinkkemper@uu.nl"
      }
    ],
    cvFilePath: fileName,
    cvFileUrl: url 
  };
};