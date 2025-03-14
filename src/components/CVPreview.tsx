
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";
import { ParsedCV } from "@/services/documentParser";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type CVPreviewProps = {
  cvData: ParsedCV;
  onCVUpdate: (updatedCV: ParsedCV) => void;
};

const CVPreview: React.FC<CVPreviewProps> = ({ cvData, onCVUpdate }) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<ParsedCV>(cvData);

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
    toast.success("CV content updated successfully");
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setEditingData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo!,
        [field]: value
      }
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updatedExperience = [...(editingData.experience || [])];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };
    
    setEditingData(prev => ({
      ...prev,
      experience: updatedExperience
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...(editingData.education || [])];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    
    setEditingData(prev => ({
      ...prev,
      education: updatedEducation
    }));
  };

  const updatePublications = (index: number, field: string, value: string) => {
    const updatedPublications = [...(editingData.publications || [])];
    updatedPublications[index] = {
      ...updatedPublications[index],
      [field]: value
    };
    
    setEditingData(prev => ({
      ...prev,
      publications: updatedPublications
    }));
  };

  const renderPersonalInfoSection = () => {
    const info = editMode === 'personalInfo' ? editingData.personalInfo : cvData.personalInfo;
    if (!info) return null;

    if (editMode === 'personalInfo') {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <Input 
              value={info.name} 
              onChange={(e) => updatePersonalInfo('name', e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Title</label>
            <Input 
              value={info.title || ''} 
              onChange={(e) => updatePersonalInfo('title', e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <Input 
              value={info.email} 
              onChange={(e) => updatePersonalInfo('email', e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Phone</label>
            <Input 
              value={info.phone || ''} 
              onChange={(e) => updatePersonalInfo('phone', e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Location</label>
            <Input 
              value={info.location || ''} 
              onChange={(e) => updatePersonalInfo('location', e.target.value)} 
            />
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <p className="font-semibold text-xl">{info.name}</p>
          <p className="text-gray-600">{info.title}</p>
        </div>
        <div className="text-right">
          <p>{info.email}</p>
          {info.phone && <p>{info.phone}</p>}
          {info.location && <p>{info.location}</p>}
        </div>
      </div>
    );
  };

  const renderEducationSection = () => {
    const education = cvData.education || [];
    if (education.length === 0) return null;

    if (editMode === 'education') {
      return (
        <div className="space-y-6">
          {editingData.education?.map((edu, index) => (
            <div key={index} className="border-b pb-4 space-y-2">
              <div>
                <label className="text-sm text-gray-500">Degree</label>
                <Input 
                  value={edu.degree} 
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)} 
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Institution</label>
                <Input 
                  value={edu.institution} 
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)} 
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Year</label>
                <Input 
                  value={edu.year} 
                  onChange={(e) => updateEducation(index, 'year', e.target.value)} 
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Description</label>
                <Textarea 
                  value={edu.description || ''} 
                  onChange={(e) => updateEducation(index, 'description', e.target.value)} 
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="md:col-span-2">
              <p className="font-medium">{edu.degree}</p>
              <p className="text-gray-600">{edu.institution}</p>
              {edu.description && <p className="text-sm text-gray-500 mt-1">{edu.description}</p>}
            </div>
            <div className="text-right">
              <p className="text-gray-600">{edu.year}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderExperienceSection = () => {
    const experience = cvData.experience || [];
    if (experience.length === 0) return null;

    if (editMode === 'experience') {
      return (
        <div className="space-y-6">
          {editingData.experience?.map((exp, index) => (
            <div key={index} className="border-b pb-4 space-y-2">
              <div>
                <label className="text-sm text-gray-500">Title</label>
                <Input 
                  value={exp.title} 
                  onChange={(e) => updateExperience(index, 'title', e.target.value)} 
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Company</label>
                <Input 
                  value={exp.company} 
                  onChange={(e) => updateExperience(index, 'company', e.target.value)} 
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Period</label>
                <Input 
                  value={exp.period} 
                  onChange={(e) => updateExperience(index, 'period', e.target.value)} 
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Description</label>
                <Textarea 
                  value={exp.description} 
                  onChange={(e) => updateExperience(index, 'description', e.target.value)} 
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {experience.map((exp, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="md:col-span-2">
              <p className="font-medium">{exp.title}</p>
              <p className="text-gray-600">{exp.company}</p>
              <p className="text-sm text-gray-500 mt-1">{exp.description}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">{exp.period}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPublicationsSection = () => {
    const publications = cvData.publications || [];
    if (publications.length === 0) return null;

    if (editMode === 'publications') {
      return (
        <div className="space-y-6">
          {editingData.publications?.map((pub, index) => (
            <div key={index} className="border-b pb-4 space-y-2">
              <div>
                <label className="text-sm text-gray-500">Title</label>
                <Input 
                  value={pub.title} 
                  onChange={(e) => updatePublications(index, 'title', e.target.value)} 
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Authors</label>
                <Input 
                  value={pub.authors} 
                  onChange={(e) => updatePublications(index, 'authors', e.target.value)} 
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Venue</label>
                <Input 
                  value={pub.venue} 
                  onChange={(e) => updatePublications(index, 'venue', e.target.value)} 
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Year</label>
                <Input 
                  value={pub.year} 
                  onChange={(e) => updatePublications(index, 'year', e.target.value)} 
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Link</label>
                <Input 
                  value={pub.link || ''} 
                  onChange={(e) => updatePublications(index, 'link', e.target.value)} 
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {publications.map((pub, index) => (
          <div key={index} className="space-y-1">
            <p className="font-medium">{pub.title}</p>
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
    );
  };

  const getSectionEditButton = (section: string) => {
    if (editMode === section) {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      );
    }
    
    return (
      <Button size="sm" variant="ghost" onClick={() => handleEdit(section)}>
        <Edit className="h-4 w-4 mr-1" /> Edit
      </Button>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg">CV Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 max-h-[700px] overflow-y-auto">
        <div className="bg-white border rounded-md p-6 space-y-6">
          {cvData.personalInfo && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center border-b pb-2 mb-3">
                <h3 className="font-medium text-lg">Personal Information</h3>
                {getSectionEditButton('personalInfo')}
              </div>
              {renderPersonalInfoSection()}
            </div>
          )}

          {cvData.education && cvData.education.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center border-b pb-2 mb-3">
                <h3 className="font-medium text-lg">Education</h3>
                {getSectionEditButton('education')}
              </div>
              {renderEducationSection()}
            </div>
          )}

          {cvData.experience && cvData.experience.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center border-b pb-2 mb-3">
                <h3 className="font-medium text-lg">Experience</h3>
                {getSectionEditButton('experience')}
              </div>
              {renderExperienceSection()}
            </div>
          )}

          {cvData.publications && cvData.publications.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center border-b pb-2 mb-3">
                <h3 className="font-medium text-lg">Publications</h3>
                {getSectionEditButton('publications')}
              </div>
              {renderPublicationsSection()}
            </div>
          )}

          {/* You can add more sections here for skills, languages, achievements, etc. */}
        </div>
      </CardContent>
    </Card>
  );
};

export default CVPreview;
