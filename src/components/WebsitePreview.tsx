import React from "react";
import { ParsedCV } from "@/services/documentParser";

type WebsitePreviewProps = {
  cvData: ParsedCV | null;
  template: string;
  websiteSettings: {
    theme: string;
    domain: string;
    sections: Record<string, boolean>;
  };
};

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ 
  cvData, 
  template, 
  websiteSettings 
}) => {
  if (!cvData) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-gray-500">
          No CV data available. Import your CV first to see a preview.
        </p>
      </div>
    );
  }

  const renderAcademicTemplate = () => (
    <div className="font-serif">
      {/* Header */}
      <div className="bg-gray-100 py-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{cvData.personalInfo?.name}</h1>
        <p className="text-lg text-gray-600">{cvData.personalInfo?.title}</p>
        <div className="flex justify-center gap-4 mt-4">
          <span>{cvData.personalInfo?.email}</span>
          {cvData.personalInfo?.phone && <span>{cvData.personalInfo?.phone}</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {websiteSettings.sections.about && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">About</h2>
            <p className="text-gray-700">
              Academic researcher with expertise in computer science. Currently focusing on artificial intelligence
              and machine learning applications in academic research.
            </p>
          </div>
        )}

        {websiteSettings.sections.education && cvData.education && cvData.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">Education</h2>
            <div className="space-y-4">
              {cvData.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                    </div>
                    <span className="text-gray-500">{edu.year}</span>
                  </div>
                  {edu.description && <p className="mt-1 text-gray-700">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {websiteSettings.sections.experience && cvData.experience && cvData.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">Experience</h2>
            <div className="space-y-6">
              {cvData.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium">{exp.title}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                    <span className="text-gray-500">{exp.period}</span>
                  </div>
                  <p className="mt-2 text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {websiteSettings.sections.publications && cvData.publications && cvData.publications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">Publications</h2>
            <div className="space-y-4">
              {cvData.publications.map((pub, index) => (
                <div key={index} className="border-l-4 border-gray-200 pl-4">
                  <h3 className="text-lg font-medium">{pub.title}</h3>
                  <p className="text-sm text-gray-600">{pub.authors}</p>
                  <p className="text-sm">
                    {pub.venue}, {pub.year}
                    {pub.link && (
                      <a href={pub.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                        Link
                      </a>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {websiteSettings.sections.contact && (
          <div>
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">Contact</h2>
            <div className="bg-gray-50 p-4 rounded">
              <p className="mb-2">
                <strong>Email:</strong> {cvData.personalInfo?.email}
              </p>
              {cvData.personalInfo?.phone && (
                <p className="mb-2">
                  <strong>Phone:</strong> {cvData.personalInfo?.phone}
                </p>
              )}
              {cvData.personalInfo?.location && (
                <p>
                  <strong>Location:</strong> {cvData.personalInfo?.location}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderModernTemplate = () => (
    <div className="font-sans">
      {/* Header - Modern Style */}
      <div className="bg-blue-700 text-white py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">{cvData.personalInfo?.name}</h1>
          <p className="text-xl opacity-90">{cvData.personalInfo?.title}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <span className="bg-blue-800 px-3 py-1 rounded-full text-sm">{cvData.personalInfo?.email}</span>
            {cvData.personalInfo?.phone && 
              <span className="bg-blue-800 px-3 py-1 rounded-full text-sm">{cvData.personalInfo?.phone}</span>
            }
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8">
        {websiteSettings.sections.about && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">About Me</h2>
            <p className="text-gray-700 leading-relaxed">
              Innovative academic researcher with a passion for pushing the boundaries of knowledge.
              My research focuses on the intersection of computer science and practical applications.
            </p>
          </div>
        )}

        {websiteSettings.sections.education && cvData.education && cvData.education.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Education</h2>
            <div className="space-y-8">
              {cvData.education.map((edu, index) => (
                <div key={index} className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 font-medium text-blue-600 mb-2 md:mb-0">
                    {edu.year}
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-semibold">{edu.degree}</h3>
                    <p className="text-gray-600 mb-2">{edu.institution}</p>
                    {edu.description && <p className="text-gray-700">{edu.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {websiteSettings.sections.experience && cvData.experience && cvData.experience.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Experience</h2>
            <div className="space-y-8">
              {cvData.experience.map((exp, index) => (
                <div key={index} className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 font-medium text-blue-600 mb-2 md:mb-0">
                    {exp.period}
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-semibold">{exp.title}</h3>
                    <p className="text-gray-600 mb-2">{exp.company}</p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other sections would be implemented similarly */}
      </div>
    </div>
  );

  const renderMinimalTemplate = () => (
    <div className="font-sans bg-white text-gray-800">
      {/* Minimal Header */}
      <div className="py-10 text-center">
        <h1 className="text-3xl font-light tracking-wider mb-1">{cvData.personalInfo?.name}</h1>
        <p className="text-gray-500 tracking-wide">{cvData.personalInfo?.title}</p>
        <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
          <span>{cvData.personalInfo?.email}</span>
          {cvData.personalInfo?.phone && <span>· {cvData.personalInfo?.phone}</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-12">
        {/* Minimal styling for each section */}
        {/* Only showing a subset for brevity */}
        {websiteSettings.sections.education && cvData.education && cvData.education.length > 0 && (
          <div>
            <h2 className="text-xl tracking-wide text-center mb-8">Education</h2>
            <div className="space-y-6">
              {cvData.education.map((edu, index) => (
                <div key={index} className="border-t pt-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>{edu.institution}</span>
                    <span>{edu.year}</span>
                  </div>
                  <h3 className="font-medium">{edu.degree}</h3>
                  {edu.description && <p className="text-sm text-gray-600 mt-2">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {websiteSettings.sections.publications && cvData.publications && cvData.publications.length > 0 && (
          <div>
            <h2 className="text-xl tracking-wide text-center mb-8">Publications</h2>
            <div className="space-y-6">
              {cvData.publications.map((pub, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium mb-1">{pub.title}</p>
                  <p className="text-gray-600">{pub.authors}</p>
                  <p className="text-gray-500">{pub.venue}, {pub.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Choose template to render
  const getTemplatePreview = () => {
    switch (template) {
      case 'academic':
        return renderAcademicTemplate();
      case 'modern':
        return renderModernTemplate();
      case 'minimal':
        return renderMinimalTemplate();
      case 'portfolio':
        // Portfolio template would go here
        return renderModernTemplate(); // Fallback for now
      default:
        return renderAcademicTemplate();
    }
  };

  return (
    <div className="border rounded-md overflow-hidden bg-white h-full shadow-sm">
      <div className={`${websiteSettings.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        {getTemplatePreview()}
      </div>
    </div>
  );
};

export default WebsitePreview;
