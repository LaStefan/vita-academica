import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Save, Trash, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ParsedCV } from '@/types/parsed-cv';

type CVPreviewProps = {
  cvData: ParsedCV;
  onCVUpdate: (updatedCV: ParsedCV) => void;
  visibleSections?: {
    summary: boolean;
    education: boolean;
    experience: boolean;
    achievements: boolean;
    publications: boolean;
    skills: boolean;
    languages: boolean;
    references: boolean;
  };
};

const CVPreview: React.FC<CVPreviewProps> = ({
  cvData,
  onCVUpdate,
  visibleSections = {
    summary: true,
    education: true,
    experience: true,
    achievements: true,
    publications: true,
    skills: true,
    languages: true,
    references: true,
  },
}) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<ParsedCV>(cvData);

  // Add this at the beginning of your CVPreview.tsx render function
  React.useEffect(() => {
    // Create a deep copy with default values for missing fields
    const dataCopy = JSON.parse(JSON.stringify(cvData || {}));

    // Ensure all required objects and arrays exist
    if (!dataCopy.personalInfo) {
      dataCopy.personalInfo = { name: '', email: '' };
    }

    // Initialize other sections if they don't exist
    dataCopy.education = dataCopy.education || [];
    dataCopy.experience = dataCopy.experience || [];
    dataCopy.skills = dataCopy.skills || [];
    dataCopy.publications = dataCopy.publications || [];
    dataCopy.references = dataCopy.references || [];
    dataCopy.languages = dataCopy.languages || [];
    dataCopy.achievements = dataCopy.achievements || [];

    setEditingData(dataCopy);
  }, [cvData]);

  // Create a deep copy to avoid reference issues when editing
  React.useEffect(() => {
    setEditingData(JSON.parse(JSON.stringify(cvData)));
  }, [cvData]);

  const handleEdit = (section: string) => {
    setEditMode(section);
  };

  const handleCancel = () => {
    setEditingData(JSON.parse(JSON.stringify(cvData)));
    setEditMode(null);
  };

  const handleSave = () => {
    onCVUpdate(editingData);
    setEditMode(null);
    toast.success('CV content updated successfully');
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setEditingData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo!,
        [field]: value,
      },
    }));
  };

  const updateSummary = (value: string) => {
    setEditingData((prev) => ({
      ...prev,
      summary: value,
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updatedExperience = [...(editingData.experience || [])];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };

    setEditingData((prev) => ({
      ...prev,
      experience: updatedExperience,
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...(editingData.education || [])];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };

    setEditingData((prev) => ({
      ...prev,
      education: updatedEducation,
    }));
  };

  const updatePublications = (index: number, field: string, value: string) => {
    const updatedPublications = [...(editingData.publications || [])];
    updatedPublications[index] = {
      ...updatedPublications[index],
      [field]: value,
    };

    setEditingData((prev) => ({
      ...prev,
      publications: updatedPublications,
    }));
  };

  const updateReferences = (index: number, field: string, value: string) => {
    const updatedReferences = [...(editingData.references || [])];
    updatedReferences[index] = {
      ...updatedReferences[index],
      [field]: value,
    };

    setEditingData((prev) => ({
      ...prev,
      references: updatedReferences,
    }));
  };
  const updateCustomSection = (index: number, field: string, value: string) => {
    const updatedCustomSections = [...(editingData.customSections || [])];
    updatedCustomSections[index] = {
      ...updatedCustomSections[index],
      [field]: value,
    };

    setEditingData((prev) => ({
      ...prev,
      customSections: updatedCustomSections,
    }));
  };

  const deleteCustomSection = (id: string) => {
    const updatedCustomSections = (editingData.customSections || []).filter(
      (section) => section.id !== id
    );

    setEditingData((prev) => ({
      ...prev,
      customSections: updatedCustomSections,
    }));

    // If we're currently editing this section, exit edit mode
    if (editMode === `custom-${id}`) {
      setEditMode(null);
    }

    // Update the CV data
    onCVUpdate({
      ...editingData,
      customSections: updatedCustomSections,
    });

    toast.success('Custom section removed');
  };

  const renderCustomSections = () => {
    const customSections = cvData.customSections || [];

    return (
      <>
        {customSections.map((section) => (
          <div key={section.id} className='bg-gray-50 p-4 rounded-lg mb-6'>
            <div className='flex justify-between items-center border-b pb-2 mb-3'>
              <h3 className='font-medium text-lg'>{section.title}</h3>
              <div className='flex gap-2'>
                {editMode === `custom-${section.id}` ? (
                  <div className='flex gap-2'>
                    <Button size='sm' variant='outline' onClick={handleCancel}>
                      <X className='h-4 w-4 mr-1' /> Cancel
                    </Button>
                    <Button size='sm' onClick={handleSave}>
                      <Save className='h-4 w-4 mr-1' /> Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleEdit(`custom-${section.id}`)}>
                      <Edit className='h-4 w-4 mr-1' /> Edit
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => deleteCustomSection(section.id)}
                      className='text-red-500 hover:text-red-700'>
                      <Trash className='h-4 w-4' />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {editMode === `custom-${section.id}` ? (
              <div className='space-y-4'>
                <div>
                  <label className='text-sm text-gray-500'>Section Title</label>
                  <Input
                    value={
                      editingData.customSections?.find(
                        (s) => s.id === section.id
                      )?.title || ''
                    }
                    onChange={(e) => {
                      const index =
                        editingData.customSections?.findIndex(
                          (s) => s.id === section.id
                        ) || 0;
                      updateCustomSection(index, 'title', e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label className='text-sm text-gray-500'>Content</label>
                  <Textarea
                    value={
                      editingData.customSections?.find(
                        (s) => s.id === section.id
                      )?.content || ''
                    }
                    onChange={(e) => {
                      const index =
                        editingData.customSections?.findIndex(
                          (s) => s.id === section.id
                        ) || 0;
                      updateCustomSection(index, 'content', e.target.value);
                    }}
                    className='min-h-[150px]'
                  />
                </div>
              </div>
            ) : (
              <div className='space-y-2'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: section.content.replace(/\n/g, '<br/>'),
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </>
    );
  };

  const renderPersonalInfoSection = () => {
    const info =
      editMode === 'personalInfo'
        ? editingData.personalInfo
        : cvData.personalInfo;
    if (!info) return null;

    if (editMode === 'personalInfo') {
      return (
        <div className='space-y-4'>
          <div>
            <label className='text-sm text-gray-500'>Name</label>
            <Input
              value={info.name}
              onChange={(e) => updatePersonalInfo('name', e.target.value)}
            />
          </div>
          <div>
            <label className='text-sm text-gray-500'>Title</label>
            <Input
              value={info.title || ''}
              onChange={(e) => updatePersonalInfo('title', e.target.value)}
            />
          </div>
          <div>
            <label className='text-sm text-gray-500'>Email</label>
            <Input
              value={info.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
            />
          </div>
          <div>
            <label className='text-sm text-gray-500'>Phone</label>
            <Input
              value={info.phone || ''}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            />
          </div>
          <div>
            <label className='text-sm text-gray-500'>Location</label>
            <Input
              value={info.location || ''}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
            />
          </div>
        </div>
      );
    }

    return (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <div>
          <p className='font-semibold text-xl'>{info.name}</p>
          <p className='text-gray-600'>{info.title}</p>
        </div>
        <div className='text-right'>
          <p>{info.email}</p>
          {info.phone && <p>{info.phone}</p>}
          {info.location && <p>{info.location}</p>}
        </div>
      </div>
    );
  };

  const renderSummarySection = () => {
    const summary = cvData.summary;
    if (!summary || !visibleSections.summary) return null;

    if (editMode === 'summary') {
      return (
        <div className='space-y-4'>
          <div>
            <label className='text-sm text-gray-500'>Summary</label>
            <Textarea
              value={editingData.summary || ''}
              onChange={(e) => updateSummary(e.target.value)}
              className='min-h-[100px]'
            />
          </div>
        </div>
      );
    }

    return (
      <div className='space-y-2'>
        <p className='text-gray-700'>{summary}</p>
      </div>
    );
  };

  const renderReferencesSection = () => {
    const references = cvData.references || [];
    if (references.length === 0 || !visibleSections.references) return null;

    if (editMode === 'references') {
      return (
        <div className='space-y-6'>
          {editingData.references?.map((ref, index) => (
            <div key={index} className='border-b pb-4 space-y-2'>
              <div>
                <label className='text-sm text-gray-500'>Name</label>
                <Input
                  value={ref.name}
                  onChange={(e) =>
                    updateReferences(index, 'name', e.target.value)
                  }
                />
              </div>
              <div>
                <label className='text-sm text-gray-500'>Title</label>
                <Input
                  value={ref.title}
                  onChange={(e) =>
                    updateReferences(index, 'title', e.target.value)
                  }
                />
              </div>
              <div>
                <label className='text-sm text-gray-500'>Institution</label>
                <Input
                  value={ref.institution}
                  onChange={(e) =>
                    updateReferences(index, 'institution', e.target.value)
                  }
                />
              </div>
              <div>
                <label className='text-sm text-gray-500'>Contact</label>
                <Input
                  value={ref.contact}
                  onChange={(e) =>
                    updateReferences(index, 'contact', e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className='space-y-4'>
        {references.map((ref, index) => (
          <div key={index} className='space-y-1'>
            <p className='font-medium'>{ref.name}</p>
            <p className='text-sm text-gray-600'>
              {ref.title}, {ref.institution}
            </p>
            <p className='text-sm text-gray-600'>{ref.contact}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderEducationSection = () => {
    const education = cvData.education || [];
    if (education.length === 0 || !visibleSections.education) return null;

    if (editMode === 'education') {
      return (
        <div className='space-y-6'>
          {editingData.education?.map((edu, index) => (
            <div key={index} className='border-b pb-4 space-y-2'>
              <div>
                <label className='text-sm text-gray-500'>Degree</label>
                <Input
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(index, 'degree', e.target.value)
                  }
                />
              </div>
              <div>
                <label className='text-sm text-gray-500'>Institution</label>
                <Input
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(index, 'institution', e.target.value)
                  }
                />
              </div>
              <div>
                <label className='text-sm text-gray-500'>Year</label>
                <Input
                  value={edu.year}
                  onChange={(e) =>
                    updateEducation(index, 'year', e.target.value)
                  }
                />
              </div>
              <div>
                <label className='text-sm text-gray-500'>Description</label>
                <Textarea
                  value={edu.description || ''}
                  onChange={(e) =>
                    updateEducation(index, 'description', e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className='space-y-4'>
        {education.map((edu, index) => (
          <div key={index} className='grid grid-cols-1 md:grid-cols-3 gap-2'>
            <div className='md:col-span-2'>
              <p className='font-medium'>{edu.degree}</p>
              <p className='text-gray-600'>{edu.institution}</p>
              {edu.description && (
                <p className='text-sm text-gray-500 mt-1'>{edu.description}</p>
              )}
            </div>
            <div className='text-right'>
              <p className='text-gray-600'>{edu.year}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderExperienceSection = () => {
    const experience = cvData.experience || [];
    if (experience.length === 0 || !visibleSections.experience) return null;

    if (editMode === 'experience') {
      return (
        <div className='space-y-6'>
          {editingData.experience?.map((exp, index) => (
            <div key={index} className='border-b pb-4 space-y-2'>
              <div>
                <label className='text-sm text-gray-500'>Title</label>
                <Input
                  value={exp.title}
                  onChange={(e) =>
                    updateExperience(index, 'title', e.target.value)
                  }
                />
              </div>
              <div>
                <label className='text-sm text-gray-500'>Company</label>
                <Input
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(index, 'company', e.target.value)
                  }
                />
              </div>
              <div>
                <label className='text-sm text-gray-500'>Period</label>
                <Input
                  value={exp.period}
                  onChange={(e) =>
                    updateExperience(index, 'period', e.target.value)
                  }
                />
              </div>
              <div>
                <label className='text-sm text-gray-500'>Description</label>
                <Textarea
                  value={exp.description}
                  onChange={(e) =>
                    updateExperience(index, 'description', e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className='space-y-4'>
        {experience.map((exp, index) => (
          <div key={index} className='grid grid-cols-1 md:grid-cols-3 gap-2'>
            <div className='md:col-span-2'>
              <p className='font-medium'>{exp.title}</p>
              <p className='text-gray-600'>{exp.company}</p>
              <p className='text-sm text-gray-500 mt-1'>{exp.description}</p>
            </div>
            <div className='text-right'>
              <p className='text-gray-600'>{exp.period}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPublicationsSection = () => {
    const publications = cvData.publications || [];
    if (publications.length === 0 || !visibleSections.publications) return null;

    if (editMode === 'publications') {
      return (
        <div className='space-y-6'>
          {editingData.publications?.map((pub, index) => (
            <div key={index} className='border-b pb-4 space-y-2'>
              <div>
                <label className='text-sm text-gray-500'>Title</label>
                <Input
                  value={pub.title}
                  onChange={(e) =>
                    updatePublications(index, 'title', e.target.value)
                  }
                />
              </div>
              <div>
                <label className='text-sm text-gray-500'>Authors</label>
                <Input
                  value={pub.authors}
                  onChange={(e) =>
                    updatePublications(index, 'authors', e.target.value)
                  }
                />
              </div>
              <div>
                <label className='text-sm text-gray-500'>Venue</label>
                <Input
                  value={pub.venue}
                  onChange={(e) =>
                    updatePublications(index, 'venue', e.target.value)
                  }
                />
              </div>
              <div>
                <label className='text-sm text-gray-500'>Year</label>
                <Input
                  value={pub.year}
                  onChange={(e) =>
                    updatePublications(index, 'year', e.target.value)
                  }
                />
              </div>
              <div>
                <label className='text-sm text-gray-500'>Link</label>
                <Input
                  value={pub.link || ''}
                  onChange={(e) =>
                    updatePublications(index, 'link', e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className='space-y-4'>
        {publications.map((pub, index) => (
          <div key={index} className='space-y-1'>
            <p className='font-medium'>{pub.title}</p>
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
    );
  };

  const renderSkillsSection = () => {
    const skills = cvData.skills || [];
    if (skills.length === 0 || !visibleSections.skills) return null;

    if (editMode === 'skills') {
      return <div>Skills editing UI</div>;
    }

    return (
      <div className='space-y-2'>
        <div className='flex flex-wrap gap-2'>
          {skills.map((skill, index) => (
            <span key={index} className='bg-gray-100 px-2 py-1 rounded text-sm'>
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguagesSection = () => {
    const languages = cvData.languages || [];
    if (languages.length === 0 || !visibleSections.languages) return null;

    if (editMode === 'languages') {
      return <div>Languages editing UI</div>;
    }

    return (
      <div className='space-y-3'>
        {languages.map((lang, index) => (
          <div key={index} className='flex justify-between'>
            <span>{lang.language}</span>
            <span className='text-gray-600'>{lang.proficiency}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderAchievementsSection = () => {
    const achievements = cvData.achievements || [];
    if (achievements.length === 0 || !visibleSections.achievements) return null;

    if (editMode === 'achievements') {
      return <div>Achievements editing UI</div>;
    }

    return (
      <div className='space-y-2'>
        <ul className='list-disc pl-5'>
          {achievements.map((achievement, index) => (
            <li key={index}>{achievement}</li>
          ))}
        </ul>
      </div>
    );
  };

  const getSectionEditButton = (section: string) => {
    if (editMode === section) {
      return (
        <div className='flex gap-2'>
          <Button size='sm' variant='outline' onClick={handleCancel}>
            <X className='h-4 w-4 mr-1' /> Cancel
          </Button>
          <Button size='sm' onClick={handleSave}>
            <Save className='h-4 w-4 mr-1' /> Save
          </Button>
        </div>
      );
    }

    return (
      <Button size='sm' variant='ghost' onClick={() => handleEdit(section)}>
        <Edit className='h-4 w-4 mr-1' /> Edit
      </Button>
    );
  };

  return (
    <div className='space-y-6 w-full'>
      <div className='bg-white border rounded-md p-6 space-y-6'>
        {cvData.personalInfo && (
          <div className='bg-gray-50 p-4 rounded-lg'>
            <div className='flex justify-between items-center border-b pb-2 mb-3'>
              <h3 className='font-medium text-lg'>Personal Information</h3>
              {getSectionEditButton('personalInfo')}
            </div>
            {renderPersonalInfoSection()}
          </div>
        )}

        {cvData.summary && visibleSections.summary && (
          <div className='bg-gray-50 p-4 rounded-lg'>
            <div className='flex justify-between items-center border-b pb-2 mb-3'>
              <h3 className='font-medium text-lg'>Summary</h3>
              {getSectionEditButton('summary')}
            </div>
            {renderSummarySection()}
          </div>
        )}

        {cvData.education &&
          cvData.education.length > 0 &&
          visibleSections.education && (
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='flex justify-between items-center border-b pb-2 mb-3'>
                <h3 className='font-medium text-lg'>Education</h3>
                {getSectionEditButton('education')}
              </div>
              {renderEducationSection()}
            </div>
          )}

        {cvData.experience &&
          cvData.experience.length > 0 &&
          visibleSections.experience && (
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='flex justify-between items-center border-b pb-2 mb-3'>
                <h3 className='font-medium text-lg'>Experience</h3>
                {getSectionEditButton('experience')}
              </div>
              {renderExperienceSection()}
            </div>
          )}

        {cvData.publications &&
          cvData.publications.length > 0 &&
          visibleSections.publications && (
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='flex justify-between items-center border-b pb-2 mb-3'>
                <h3 className='font-medium text-lg'>Publications</h3>
                {getSectionEditButton('publications')}
              </div>
              {renderPublicationsSection()}
            </div>
          )}

        {cvData.references &&
          cvData.references.length > 0 &&
          visibleSections.references && (
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='flex justify-between items-center border-b pb-2 mb-3'>
                <h3 className='font-medium text-lg'>References</h3>
                {getSectionEditButton('references')}
              </div>
              {renderReferencesSection()}
            </div>
          )}

        {cvData.skills &&
          cvData.skills.length > 0 &&
          visibleSections.skills && (
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='flex justify-between items-center border-b pb-2 mb-3'>
                <h3 className='font-medium text-lg'>Skills</h3>
                {getSectionEditButton('skills')}
              </div>
              {renderSkillsSection()}
            </div>
          )}

        {cvData.languages &&
          cvData.languages.length > 0 &&
          visibleSections.languages && (
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='flex justify-between items-center border-b pb-2 mb-3'>
                <h3 className='font-medium text-lg'>Languages</h3>
                {getSectionEditButton('languages')}
              </div>
              {renderLanguagesSection()}
            </div>
          )}

        {cvData.achievements &&
          cvData.achievements.length > 0 &&
          visibleSections.achievements && (
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='flex justify-between items-center border-b pb-2 mb-3'>
                <h3 className='font-medium text-lg'>Achievements</h3>
                {getSectionEditButton('achievements')}
              </div>
              {renderAchievementsSection()}
            </div>
          )}
        {renderCustomSections()}
      </div>
    </div>
  );
};

export default CVPreview;
