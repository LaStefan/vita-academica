import React from 'react';
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { type ParsedCV } from '@/types/parsed-cv';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  modern: {
    flexDirection: 'column',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  academic: {
    flexDirection: 'column',
    padding: 30,
    fontFamily: 'Times-Roman',
  },
  minimalist: {
    flexDirection: 'column',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modernHeader: {
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: '#2c3e50',
    padding: 20,
    color: 'white',
    marginLeft: -30,
    marginRight: -30,
    marginTop: -30,
  },
  academicHeader: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottom: '1pt solid #aaa',
  },
  minimalistHeader: {
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
    fontStyle: 'italic',
  },
  contact: {
    fontSize: 10,
    marginBottom: 5,
    color: '#666',
  },
  modernContact: {
    fontSize: 10,
    marginBottom: 5,
    color: '#eee',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottom: '1pt solid #ddd',
    paddingBottom: 2,
  },
  modernSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    borderBottom: '1pt solid #ddd',
    paddingBottom: 2,
  },
  academicSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  minimalistSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  item: {
    marginBottom: 10,
  },
  itemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 10,
    marginBottom: 2,
  },
  itemPeriod: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  itemDescription: {
    fontSize: 10,
    color: '#444',
    marginTop: 2,
  },
  publications: {
    marginBottom: 15,
  },
  publication: {
    marginBottom: 8,
  },
  publicationTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  publicationAuthors: {
    fontSize: 9,
    marginBottom: 2,
  },
  publicationVenue: {
    fontSize: 9,
    fontStyle: 'italic',
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  skill: {
    fontSize: 10,
    backgroundColor: '#f0f0f0',
    padding: '2 5',
    borderRadius: 3,
    margin: 2,
  },
  minimalistSkill: {
    fontSize: 10,
    borderBottom: '0.5pt solid #ddd',
    padding: '2 5',
    margin: 2,
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
  },
});

// PDF Document component
const CVDocument = ({
  cvData,
  template = 'classic',
  visibleSections = {},
}: {
  cvData: ParsedCV;
  template?: string;
  visibleSections?: Record<string, boolean>;
}) => {
  // Get template-specific styles
  const getPageStyle = () => {
    switch (template) {
      case 'modern':
        return styles.modern;
      case 'academic':
        return styles.academic;
      case 'minimalist':
        return styles.minimalist;
      default:
        return styles.page;
    }
  };

  const getHeaderStyle = () => {
    switch (template) {
      case 'modern':
        return styles.modernHeader;
      case 'academic':
        return styles.academicHeader;
      case 'minimalist':
        return styles.minimalistHeader;
      default:
        return styles.header;
    }
  };

  const getSectionTitleStyle = () => {
    switch (template) {
      case 'modern':
        return styles.modernSectionTitle;
      case 'academic':
        return styles.academicSectionTitle;
      case 'minimalist':
        return styles.minimalistSectionTitle;
      default:
        return styles.sectionTitle;
    }
  };

  const getContactStyle = () => {
    return template === 'modern' ? styles.modernContact : styles.contact;
  };

  const getSkillStyle = () => {
    return template === 'minimalist' ? styles.minimalistSkill : styles.skill;
  };

  return (
    <Document>
      <Page size='A4' style={getPageStyle()}>
        {/* Header with personal information */}
        <View style={getHeaderStyle()}>
          <Text style={styles.name}>{cvData.personalInfo?.name}</Text>
          {cvData.personalInfo?.title && (
            <Text style={styles.title}>{cvData.personalInfo.title}</Text>
          )}
          <Text style={getContactStyle()}>
            {[
              cvData.personalInfo?.email,
              cvData.personalInfo?.phone,
              cvData.personalInfo?.location,
            ]
              .filter(Boolean)
              .join(' | ')}
          </Text>
        </View>

        {/* Summary */}
        {cvData.summary && visibleSections.summary !== false && (
          <View style={styles.section}>
            <Text style={getSectionTitleStyle()}>
              {template === 'academic' ? 'Research Interests' : 'Summary'}
            </Text>
            <Text style={styles.text}>{cvData.summary}</Text>
          </View>
        )}

        {/* Education Section */}
        {cvData.education &&
          cvData.education.length > 0 &&
          visibleSections.education !== false && (
            <View style={styles.section}>
              <Text style={getSectionTitleStyle()}>Education</Text>
              {cvData.education.map((edu, index) => (
                <View key={`edu-${index}`} style={styles.item}>
                  <View style={styles.itemTitleRow}>
                    <Text style={styles.itemTitle}>{edu.degree}</Text>
                    <Text style={styles.itemPeriod}>{edu.year}</Text>
                  </View>
                  <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                  {edu.description && (
                    <Text style={styles.itemDescription}>
                      {edu.description}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

        {/* Experience Section */}
        {cvData.experience &&
          cvData.experience.length > 0 &&
          visibleSections.experience !== false && (
            <View style={styles.section}>
              <Text style={getSectionTitleStyle()}>Experience</Text>
              {cvData.experience.map((exp, index) => (
                <View key={`exp-${index}`} style={styles.item}>
                  <View style={styles.itemTitleRow}>
                    <Text style={styles.itemTitle}>{exp.title}</Text>
                    <Text style={styles.itemPeriod}>{exp.period}</Text>
                  </View>
                  <Text style={styles.itemSubtitle}>{exp.company}</Text>
                  <Text style={styles.itemDescription}>{exp.description}</Text>
                </View>
              ))}
            </View>
          )}

        {/* Skills Section */}
        {cvData.skills &&
          cvData.skills.length > 0 &&
          visibleSections.skills !== false && (
            <View style={styles.section}>
              <Text style={getSectionTitleStyle()}>Skills</Text>
              <View style={styles.skills}>
                {cvData.skills.map((skill, index) => (
                  <Text key={`skill-${index}`} style={getSkillStyle()}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          )}

        {/* Publications Section */}
        {cvData.publications &&
          cvData.publications.length > 0 &&
          visibleSections.publications !== false && (
            <View style={styles.section}>
              <Text style={getSectionTitleStyle()}>Publications</Text>
              {cvData.publications.map((pub, index) => (
                <View key={`pub-${index}`} style={styles.publication}>
                  <Text style={styles.publicationTitle}>{pub.title}</Text>
                  <Text style={styles.publicationAuthors}>{pub.authors}</Text>
                  <Text style={styles.publicationVenue}>
                    {pub.venue}, {pub.year}
                  </Text>
                </View>
              ))}
            </View>
          )}

        {/* Languages Section */}
        {cvData.languages &&
          cvData.languages.length > 0 &&
          visibleSections.languages !== false && (
            <View style={styles.section}>
              <Text style={getSectionTitleStyle()}>Languages</Text>
              {cvData.languages.map((lang, index) => (
                <Text key={`lang-${index}`} style={styles.text}>
                  {lang.language}: {lang.proficiency}
                </Text>
              ))}
            </View>
          )}

        {/* Achievements Section */}
        {cvData.achievements &&
          cvData.achievements.length > 0 &&
          visibleSections.achievements !== false && (
            <View style={styles.section}>
              <Text style={getSectionTitleStyle()}>Achievements</Text>
              {cvData.achievements.map((achievement, index) => (
                <Text key={`achievement-${index}`} style={styles.text}>
                  • {achievement}
                </Text>
              ))}
            </View>
          )}

        {/* References Section */}
        {cvData.references &&
          cvData.references.length > 0 &&
          visibleSections.references !== false && (
            <View style={styles.section}>
              <Text style={getSectionTitleStyle()}>References</Text>
              {cvData.references.map((ref, index) => (
                <View key={`ref-${index}`} style={styles.item}>
                  <Text style={styles.itemTitle}>{ref.name}</Text>
                  <Text style={styles.itemSubtitle}>
                    {ref.title}, {ref.institution}
                  </Text>
                  <Text style={styles.text}>{ref.contact}</Text>
                </View>
              ))}
            </View>
          )}

        {/* Custom Sections */}
        {cvData.customSections &&
          cvData.customSections.map((section, index) => (
            <View key={`custom-${index}`} style={styles.section}>
              <Text style={getSectionTitleStyle()}>{section.title}</Text>
              <Text style={styles.text}>{section.content}</Text>
            </View>
          ))}
      </Page>
    </Document>
  );
};

// Generate PDF blob
export const generatePDFBlob = async (
  cvData: ParsedCV,
  template: string = 'classic',
  visibleSections: Record<string, boolean> = {}
): Promise<Blob> => {
  try {
    return await pdf(
      <CVDocument
        cvData={cvData}
        template={template}
        visibleSections={visibleSections}
      />
    ).toBlob();
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    // Return a simple error PDF as fallback
    return await pdf(
      <Document>
        <Page size='A4' style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Error</Text>
            <Text style={styles.text}>
              Failed to generate PDF. Please try again.
            </Text>
          </View>
        </Page>
      </Document>
    ).toBlob();
  }
};

// PDF Preview component
export const CVPDFPreview: React.FC<{
  cvData: ParsedCV;
  template?: string;
  visibleSections?: Record<string, boolean>;
}> = ({ cvData, template = 'classic', visibleSections = {} }) => {
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const generatePreview = async () => {
      try {
        setLoading(true);
        setError(false);

        // Generate the PDF blob
        const blob = await generatePDFBlob(cvData, template, visibleSections);

        if (isMounted) {
          // Create a URL for the blob
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          setLoading(false);
        }
      } catch (err) {
        console.error('PDF preview generation error:', err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    generatePreview();

    return () => {
      isMounted = false;
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [cvData, template, visibleSections]);

  if (loading) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-academic-orange border-r-transparent align-[-0.125em]'></div>
          <p className='mt-2 text-academic-orange'>Generating preview...</p>
        </div>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-500 mb-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-12 w-12 mx-auto'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <p className='text-gray-700'>Failed to generate PDF preview</p>
          <p className='text-gray-500 text-sm'>
            Please try a different template or check your CV data
          </p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      title='PDF Preview'
      className='w-full h-full border-0'
      src={pdfUrl}
      style={{ minHeight: '500px' }}
    />
  );
};

// PDF Download Link component
export const CVPDFDownloadLink: React.FC<{
  cvData: ParsedCV;
  template?: string;
  fileName?: string;
  visibleSections?: Record<string, boolean>;
  children: React.ReactNode;
}> = ({
  cvData,
  template = 'classic',
  fileName = 'cv.pdf',
  visibleSections = {},
  children,
}) => {
  const [url, setUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    return () => {
      isMounted = false;
      // Clean up the URL when the component unmounts
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  const handleClick = async (e: React.MouseEvent) => {
    // Only prevent default if we need to generate the PDF
    if (!url) {
      e.preventDefault();
    }

    if (loading || error) return;

    if (!url) {
      setLoading(true);
      try {
        // Generate the PDF blob
        const blob = await generatePDFBlob(cvData, template, visibleSections);

        // Create a URL for the blob
        const newUrl = URL.createObjectURL(blob);
        setUrl(newUrl);

        // Trigger the download
        const link = document.createElement('a');
        link.href = newUrl;
        link.download = fileName;
        link.click();

        setLoading(false);
      } catch (err) {
        console.error('Error generating PDF for download:', err);
        setError(true);
        setLoading(false);
      }
    }
  };

  return (
    <a
      href={url || '#'}
      download={fileName}
      onClick={handleClick}
      className={`inline-flex ${
        loading || error ? 'opacity-50 cursor-not-allowed' : ''
      }`}>
      {loading ? (
        <div className='flex items-center'>
          <div className='animate-spin mr-2 h-4 w-4 border-2 border-academic-orange border-r-transparent rounded-full'></div>
          <span>Generating...</span>
        </div>
      ) : error ? (
        <div className='flex items-center text-red-500'>
          <span>Error</span>
        </div>
      ) : (
        children
      )}
    </a>
  );
};
