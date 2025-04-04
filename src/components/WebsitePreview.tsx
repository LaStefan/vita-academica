import { ParsedCV } from '@/types/parsed-cv';
import React from 'react';

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
  websiteSettings,
}) => {
  if (!cvData) {
    return (
      <div className='flex flex-col items-center justify-center h-full p-8 text-center'>
        <p className='text-gray-500'>
          No CV data available. Import your CV first to see a preview.
        </p>
      </div>
    );
  }

  const renderAcademicTemplate = () => (
    <div className='font-serif'>
      {/* Header */}
      <div className='bg-gray-100 py-8 text-center'>
        <h1 className='text-3xl font-bold mb-2'>{cvData.personalInfo?.name}</h1>
        <p className='text-lg text-gray-600'>{cvData.personalInfo?.title}</p>
        <div className='flex justify-center gap-4 mt-4'>
          <span>{cvData.personalInfo?.email}</span>
          {cvData.personalInfo?.phone && <span>{cvData.personalInfo?.phone}</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-4xl mx-auto p-6'>

        {/* Summary */}
        {websiteSettings.sections.summary && cvData.summary && (
          <div className='mb-8'>
            <h2 className='text-2xl font-bold border-b pb-2 mb-4'>Summary</h2>
            <p className='text-gray-700'>{cvData.summary}</p>
          </div>
        )}

        {/* Education */}
        {websiteSettings.sections.education && cvData.education?.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-2xl font-bold border-b pb-2 mb-4'>Education</h2>
            <div className='space-y-4'>
              {cvData.education.map((edu, index) => (
                <div key={index}>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h3 className='text-xl font-medium'>{edu.degree}</h3>
                      <p className='text-gray-600'>{edu.institution}</p>
                    </div>
                    <span className='text-gray-500'>{edu.year}</span>
                  </div>
                  {edu.description && <p className='mt-1 text-gray-700'>{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {websiteSettings.sections.experience && cvData.experience?.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-2xl font-bold border-b pb-2 mb-4'>Experience</h2>
            <div className='space-y-6'>
              {cvData.experience.map((exp, index) => (
                <div key={index}>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h3 className='text-xl font-medium'>{exp.title}</h3>
                      <p className='text-gray-600'>{exp.company}</p>
                    </div>
                    <span className='text-gray-500'>{exp.period}</span>
                  </div>
                  <p className='mt-2 text-gray-700'>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {websiteSettings.sections.achievements && cvData.achievements?.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-2xl font-bold border-b pb-2 mb-4'>Achievements</h2>
            <ul className='list-disc list-inside text-gray-700'>
              {cvData.achievements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Publications */}
        {websiteSettings.sections.publications && cvData.publications?.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-2xl font-bold border-b pb-2 mb-4'>Publications</h2>
            <div className='space-y-4'>
              {cvData.publications.map((pub, index) => (
                <div key={index} className='border-l-4 border-gray-200 pl-4'>
                  <h3 className='text-lg font-medium'>{pub.title}</h3>
                  <p className='text-sm text-gray-600'>{pub.authors}</p>
                  <p className='text-sm'>
                    {pub.venue}, {pub.year}
                    {pub.link && (
                      <a
                        href={pub.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='ml-2 text-blue-600 hover:underline'>
                        Link
                      </a>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {websiteSettings.sections.skills && cvData.skills?.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-2xl font-bold border-b pb-2 mb-4'>Skills</h2>
            <ul className='flex flex-wrap gap-2'>
              {cvData.skills.map((skill, index) => (
                <li key={index} className='bg-gray-200 px-3 py-1 rounded text-sm'>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {websiteSettings.sections.languages && cvData.languages?.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-2xl font-bold border-b pb-2 mb-4'>Languages</h2>
            <ul className='space-y-2'>
              {cvData.languages.map((lang, index) => (
                <li key={index} className='text-gray-700'>
                  <strong>{lang.language}:</strong> {lang.proficiency}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* References */}
        {websiteSettings.sections.references && cvData.references?.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-2xl font-bold border-b pb-2 mb-4'>References</h2>
            <ul className='space-y-4'>
              {cvData.references.map((ref, index) => (
                <li key={index} className='text-gray-700'>
                  <p><strong>{ref.name}</strong>, {ref.title} at {ref.institution}</p>
                  <p>Contact: {ref.contact}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const renderModernTemplate = () => (
    <div className='font-sans'>
      {/* Header */}
      <div className='bg-blue-700 text-white py-12 px-8'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold mb-3'>
            {cvData.personalInfo?.name}
          </h1>
          <p className='text-xl opacity-90'>{cvData.personalInfo?.title}</p>
          <div className='mt-6 flex flex-wrap gap-4'>
            <span className='bg-blue-800 px-3 py-1 rounded-full text-sm'>
              {cvData.personalInfo?.email}
            </span>
            {cvData.personalInfo?.phone && (
              <span className='bg-blue-800 px-3 py-1 rounded-full text-sm'>
                {cvData.personalInfo?.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-4xl mx-auto p-8'>

        {/* Summary */}
        {websiteSettings.sections.summary && cvData.summary && (
          <div className='mb-12'>
            <h2 className='text-2xl font-bold text-blue-700 mb-4'>Summary</h2>
            <p className='text-gray-700 leading-relaxed'>{cvData.summary}</p>
          </div>
        )}

        {/* Education */}
        {websiteSettings.sections.education && cvData.education?.length > 0 && (
          <div className='mb-12'>
            <h2 className='text-2xl font-bold text-blue-700 mb-6'>Education</h2>
            <div className='space-y-8'>
              {cvData.education.map((edu, index) => (
                <div key={index} className='flex flex-col md:flex-row'>
                  <div className='md:w-1/4 font-medium text-blue-600 mb-2 md:mb-0'>
                    {edu.year}
                  </div>
                  <div className='md:w-3/4'>
                    <h3 className='text-xl font-semibold'>{edu.degree}</h3>
                    <p className='text-gray-600 mb-2'>{edu.institution}</p>
                    {edu.description && <p className='text-gray-700'>{edu.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {websiteSettings.sections.experience && cvData.experience?.length > 0 && (
          <div className='mb-12'>
            <h2 className='text-2xl font-bold text-blue-700 mb-6'>Experience</h2>
            <div className='space-y-8'>
              {cvData.experience.map((exp, index) => (
                <div key={index} className='flex flex-col md:flex-row'>
                  <div className='md:w-1/4 font-medium text-blue-600 mb-2 md:mb-0'>
                    {exp.period}
                  </div>
                  <div className='md:w-3/4'>
                    <h3 className='text-xl font-semibold'>{exp.title}</h3>
                    <p className='text-gray-600 mb-2'>{exp.company}</p>
                    <p className='text-gray-700'>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {websiteSettings.sections.achievements && cvData.achievements?.length > 0 && (
          <div className='mb-12'>
            <h2 className='text-2xl font-bold text-blue-700 mb-6'>Achievements</h2>
            <ul className='list-disc list-inside text-gray-700'>
              {cvData.achievements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Publications */}
        {websiteSettings.sections.publications && cvData.publications?.length > 0 && (
          <div className='mb-12'>
            <h2 className='text-2xl font-bold text-blue-700 mb-6'>Publications</h2>
            <div className='space-y-4'>
              {cvData.publications.map((pub, index) => (
                <div key={index}>
                  <h3 className='text-lg font-semibold'>{pub.title}</h3>
                  <p className='text-sm text-gray-600'>{pub.authors}</p>
                  <p className='text-sm text-gray-700'>
                    {pub.venue}, {pub.year}
                    {pub.link && (
                      <a
                        href={pub.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='ml-2 text-blue-600 hover:underline'>
                        Link
                      </a>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {websiteSettings.sections.skills && cvData.skills?.length > 0 && (
          <div className='mb-12'>
            <h2 className='text-2xl font-bold text-blue-700 mb-6'>Skills</h2>
            <ul className='flex flex-wrap gap-3'>
              {cvData.skills.map((skill, index) => (
                <li key={index} className='bg-blue-100 px-3 py-1 rounded text-sm text-blue-800'>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {websiteSettings.sections.languages && cvData.languages?.length > 0 && (
          <div className='mb-12'>
            <h2 className='text-2xl font-bold text-blue-700 mb-6'>Languages</h2>
            <ul className='space-y-2'>
              {cvData.languages.map((lang, index) => (
                <li key={index} className='text-gray-700'>
                  <strong>{lang.language}</strong>: {lang.proficiency}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* References */}
        {websiteSettings.sections.references && cvData.references?.length > 0 && (
          <div className='mb-12'>
            <h2 className='text-2xl font-bold text-blue-700 mb-6'>References</h2>
            <ul className='space-y-4'>
              {cvData.references.map((ref, index) => (
                <li key={index} className='text-gray-700'>
                  <p><strong>{ref.name}</strong>, {ref.title} at {ref.institution}</p>
                  <p>Contact: {ref.contact}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const renderMinimalTemplate = () => (
    <div className='font-sans bg-white text-gray-800'>
      {/* Header */}
      <div className='py-10 text-center'>
        <h1 className='text-3xl font-light tracking-wider mb-1'>
          {cvData.personalInfo?.name}
        </h1>
        <p className='text-gray-500 tracking-wide'>
          {cvData.personalInfo?.title}
        </p>
        <div className='flex justify-center gap-6 mt-4 text-sm text-gray-600'>
          <span>{cvData.personalInfo?.email}</span>
          {cvData.personalInfo?.phone && <span>· {cvData.personalInfo?.phone}</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-3xl mx-auto px-6 py-8 space-y-12'>

        {/* Summary */}
        {websiteSettings.sections.summary && cvData.summary && (
          <div>
            <h2 className='text-xl tracking-wide text-center mb-8'>Summary</h2>
            <p className='text-gray-700 text-sm text-justify'>{cvData.summary}</p>
          </div>
        )}

        {/* Education */}
        {websiteSettings.sections.education && cvData.education?.length > 0 && (
          <div>
            <h2 className='text-xl tracking-wide text-center mb-8'>Education</h2>
            <div className='space-y-6'>
              {cvData.education.map((edu, index) => (
                <div key={index} className='border-t pt-4'>
                  <div className='flex justify-between text-sm text-gray-500 mb-1'>
                    <span>{edu.institution}</span>
                    <span>{edu.year}</span>
                  </div>
                  <h3 className='font-medium'>{edu.degree}</h3>
                  {edu.description && (
                    <p className='text-sm text-gray-600 mt-2'>{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {websiteSettings.sections.experience && cvData.experience?.length > 0 && (
          <div>
            <h2 className='text-xl tracking-wide text-center mb-8'>Experience</h2>
            <div className='space-y-6'>
              {cvData.experience.map((exp, index) => (
                <div key={index} className='border-t pt-4'>
                  <div className='flex justify-between text-sm text-gray-500 mb-1'>
                    <span>{exp.company}</span>
                    <span>{exp.period}</span>
                  </div>
                  <h3 className='font-medium'>{exp.title}</h3>
                  {exp.description && (
                    <p className='text-sm text-gray-600 mt-2'>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {websiteSettings.sections.achievements && cvData.achievements?.length > 0 && (
          <div>
            <h2 className='text-xl tracking-wide text-center mb-8'>Achievements</h2>
            <ul className='list-disc list-inside space-y-1 text-sm text-gray-700'>
              {cvData.achievements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Publications */}
        {websiteSettings.sections.publications && cvData.publications?.length > 0 && (
          <div>
            <h2 className='text-xl tracking-wide text-center mb-8'>Publications</h2>
            <div className='space-y-6'>
              {cvData.publications.map((pub, index) => (
                <div key={index} className='text-sm'>
                  <p className='font-medium mb-1'>{pub.title}</p>
                  <p className='text-gray-600'>{pub.authors}</p>
                  <p className='text-gray-500'>
                    {pub.venue}, {pub.year}
                    {pub.link && (
                      <a
                        href={pub.link}
                        className='ml-2 text-blue-500 underline'
                        target='_blank'
                        rel='noopener noreferrer'>
                        Link
                      </a>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {websiteSettings.sections.skills && cvData.skills?.length > 0 && (
          <div>
            <h2 className='text-xl tracking-wide text-center mb-8'>Skills</h2>
            <ul className='flex flex-wrap justify-center gap-3 text-sm'>
              {cvData.skills.map((skill, index) => (
                <li key={index} className='bg-gray-100 px-3 py-1 rounded'>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {websiteSettings.sections.languages && cvData.languages?.length > 0 && (
          <div>
            <h2 className='text-xl tracking-wide text-center mb-8'>Languages</h2>
            <ul className='space-y-2 text-sm text-gray-700'>
              {cvData.languages.map((lang, index) => (
                <li key={index}>
                  <strong>{lang.language}</strong>: {lang.proficiency}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* References */}
        {websiteSettings.sections.references && cvData.references?.length > 0 && (
          <div>
            <h2 className='text-xl tracking-wide text-center mb-8'>References</h2>
            <ul className='space-y-4 text-sm text-gray-700'>
              {cvData.references.map((ref, index) => (
                <li key={index}>
                  <p><strong>{ref.name}</strong>, {ref.title} at {ref.institution}</p>
                  <p>Contact: {ref.contact}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const renderUUTemplate = () => (
    <div className="font-sans bg-gray-50">
      {/* Header with UU Logo and Profile Picture */}
      <div className="bg-[#FFD100] text-black py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side: Logo and Name */}
            <div className="flex-1">
              {/* UU Logo */}
              <div className="mb-6">
                {/* <img src="/uu-logo.png" alt="Utrecht University Logo" className="h-12 w-auto" /> */}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-3">{cvData.personalInfo?.name}</h1>
              <p className="text-xl md:text-2xl font-light opacity-90 mb-6">{cvData.personalInfo?.title}</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <a
                  href={`mailto:${cvData.personalInfo?.email}`}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {cvData.personalInfo?.email}
                </a>
                {cvData.personalInfo?.phone && (
                  <a
                    href={`tel:${cvData.personalInfo?.phone}`}
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {cvData.personalInfo?.phone}
                  </a>
                )}
                {cvData.personalInfo?.location && (
                  <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {cvData.personalInfo?.location}
                  </span>
                )}
              </div>
            </div>

            {/* Right side: Profile Picture
            <div className="flex items-center justify-center md:justify-end">
              <div className="rounded-full overflow-hidden border-4 border-white h-40 w-40 shadow-md">
                <img
                  src={cvData.personalInfo?.image || "/professor-profile.jpg"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Navigation Bar - UU Style */}
      <div className="bg-black text-white py-3 px-6 sticky top-0 z-10 shadow-md">
        <div className="max-w-5xl mx-auto flex gap-6 overflow-x-auto">
          {websiteSettings.sections.summary && cvData.summary && (
            <a href="#summary" className="text-sm font-medium whitespace-nowrap hover:text-[#FFD100] transition-colors">
              Summary
            </a>
          )}
          {websiteSettings.sections.education && cvData.education && (
            <a href="#education" className="text-sm font-medium whitespace-nowrap hover:text-[#FFD100] transition-colors">
              Education
            </a>
          )}
          {websiteSettings.sections.experience && cvData.experience && (
            <a href="#experience" className="text-sm font-medium whitespace-nowrap hover:text-[#FFD100] transition-colors">
              Experience
            </a>
          )}
          {websiteSettings.sections.achievements && cvData.achievements && (
            <a href="#achievements" className="text-sm font-medium whitespace-nowrap hover:text-[#FFD100] transition-colors">
              Achievements
            </a>
          )}
          {websiteSettings.sections.publications && cvData.publications && (
            <a href="#publications" className="text-sm font-medium whitespace-nowrap hover:text-[#FFD100] transition-colors">
              Publications
            </a>
          )}
          {websiteSettings.sections.skills && cvData.skills && (
            <a href="#skills" className="text-sm font-medium whitespace-nowrap hover:text-[#FFD100] transition-colors">
              Skills
            </a>
          )}
          {websiteSettings.sections.languages && cvData.languages && (
            <a href="#languages" className="text-sm font-medium whitespace-nowrap hover:text-[#FFD100] transition-colors">
              Languages
            </a>
          )}
          {websiteSettings.sections.references && cvData.references && (
            <a href="#references" className="text-sm font-medium whitespace-nowrap hover:text-[#FFD100] transition-colors">
              References
            </a>
          )}
          <a href="#contact" className="text-sm font-medium whitespace-nowrap hover:text-[#FFD100] transition-colors">
            Contact
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        {websiteSettings.sections.summary && cvData.summary && (
          <div id="summary" className="mb-12 bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-black mb-4 border-b-2 border-[#FFD100] pb-2 inline-block">Summary</h2>
            <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
          </div>
        )}

        {websiteSettings.sections.education && cvData.education && cvData.education.length > 0 && (
          <div id="education" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6 border-b-2 border-[#FFD100] pb-2 inline-block">
              Education
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {cvData.education.map((edu, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold">{edu.degree}</h3>
                    <span className="bg-[#FFD100] text-black text-sm px-3 py-1 rounded-full">{edu.year}</span>
                  </div>
                  <p className="text-gray-600 mb-3">{edu.institution}</p>
                  {edu.description && <p className="text-gray-700">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {websiteSettings.sections.experience && cvData.experience && cvData.experience.length > 0 && (
          <div id="experience" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6 border-b-2 border-[#FFD100] pb-2 inline-block">
              Experience
            </h2>
            <div className="space-y-6">
              {cvData.experience.map((exp, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                    <h3 className="text-xl font-semibold">{exp.title}</h3>
                    <span className="bg-[#FFD100] text-black text-sm px-3 py-1 rounded-full mt-2 md:mt-0">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{exp.company}</p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {websiteSettings.sections.achievements && cvData.achievements && cvData.achievements.length > 0 && (
          <div id="achievements" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6 border-b-2 border-[#FFD100] pb-2 inline-block">
              Achievements
            </h2>
            <div className="space-y-4">
              {cvData.achievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <p className="text-gray-700">{achievement}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {websiteSettings.sections.publications && cvData.publications && cvData.publications.length > 0 && (
          <div id="publications" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6 border-b-2 border-[#FFD100] pb-2 inline-block">
              Publications
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {cvData.publications.map((pub, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold mb-2">{pub.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{pub.authors}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      {pub.venue}, {pub.year}
                    </p>
                    {pub.link && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-black hover:text-[#FFD100]"
                      >
                        <span>View</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {websiteSettings.sections.skills && cvData.skills && cvData.skills.length > 0 && (
          <div id="skills" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6 border-b-2 border-[#FFD100] pb-2 inline-block">
              Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {cvData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-white px-4 py-2 rounded-full text-sm shadow-sm border border-gray-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {websiteSettings.sections.languages && cvData.languages && cvData.languages.length > 0 && (
          <div id="languages" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6 border-b-2 border-[#FFD100] pb-2 inline-block">
              Languages
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {cvData.languages.map((lang, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{lang.language}</h3>
                    <span className="bg-[#FFD100] text-black text-xs px-2 py-1 rounded-full">
                      {lang.proficiency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {websiteSettings.sections.references && cvData.references && cvData.references.length > 0 && (
          <div id="references" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6 border-b-2 border-[#FFD100] pb-2 inline-block">
              References
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {cvData.references.map((reference, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{reference.name}</h3>
                  <p className="text-gray-600 mb-1">{reference.title}</p>
                  <p className="text-gray-600 mb-3">{reference.institution}</p>
                  <div className="flex flex-col gap-2">
                    <a href={`mailto:${reference.contact}`} className="text-black hover:text-[#FFD100] flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {reference.contact}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {websiteSettings.sections.customSections && cvData.customSections.length > 0 && (
          <>
            {cvData.customSections.map((section) => (
              <div key={section.id} id={section.id} className="mb-12 bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-black mb-4 border-b-2 border-[#FFD100] pb-2 inline-block">
                  {section.title}
                </h2>
                <div className="text-gray-700 leading-relaxed">{section.content}</div>
              </div>
            ))}
          </>
        )}

        <div id="contact" className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-black mb-6 border-b-2 border-[#FFD100] pb-2 inline-block">Contact</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#FFD100]/10 rounded-lg p-4 flex items-start gap-4">
              <div className="bg-[#FFD100] p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Email</h3>
                <a href={`mailto:${cvData.personalInfo?.email}`} className="text-black hover:text-[#FFD100]">
                  {cvData.personalInfo?.email}
                </a>
              </div>
            </div>

            {cvData.personalInfo?.phone && (
              <div className="bg-[#FFD100]/10 rounded-lg p-4 flex items-start gap-4">
                <div className="bg-[#FFD100] p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Phone</h3>
                  <a href={`tel:${cvData.personalInfo?.phone}`} className="text-black hover:text-[#FFD100]">
                    {cvData.personalInfo?.phone}
                  </a>
                </div>
              </div>
            )}

            {cvData.personalInfo?.location && (
              <div className="bg-[#FFD100]/10 rounded-lg p-4 flex items-start gap-4">
                <div className="bg-[#FFD100] p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Location</h3>
                  <p className="text-gray-700">{cvData.personalInfo?.location}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with UU branding */}
      <div className="bg-black text-white py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {/* <img src="/uu-logo.png" alt="Utrecht University Logo" className="h-10 w-auto" /> */}
            <div className="text-sm">
              <p>© {new Date().getFullYear()} Utrecht University</p>
              <p className="text-gray-400">Sharing science, shaping tomorrow</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="https://www.uu.nl/en/organisation/contact" className="text-sm text-gray-300 hover:text-[#FFD100]">
              Contact
            </a>
            <a
              href="https://www.uu.nl/en/organisation/practical-matters/privacy-statement"
              className="text-sm text-gray-300 hover:text-[#FFD100]"
            >
              Privacy
            </a>
            <a
              href="https://www.uu.nl/en/organisation/practical-matters/cookies"
              className="text-sm text-gray-300 hover:text-[#FFD100]"
            >
              Cookies
            </a>
          </div>
        </div>
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
      case 'uu':
        return renderUUTemplate();
      default:
        return renderAcademicTemplate();
    }
  };

  return (
    <div className='border rounded-md overflow-hidden bg-white h-full shadow-sm'>
      <div
        className={`${websiteSettings.theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-white text-black'
          }`}>
        {getTemplatePreview()}
      </div>
    </div>
  );
};

export default WebsitePreview;
