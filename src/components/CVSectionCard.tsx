import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import { type ParsedCV } from '@/types/parsed-cv';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import SocialShareMenu from './SocialShareMenu';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

type CVSectionCardProps = {
  title: string;
  icon: React.ReactNode;
  type:
  | 'experience'
  | 'education'
  | 'publications'
  | 'skills'
  | 'achievements'
  | 'references';
  items: any[];
  cvData: ParsedCV;
  onUpdate: (updatedCV: ParsedCV) => void;
  className?: string;
};

const CVSectionCard: React.FC<CVSectionCardProps> = ({
  title,
  icon,
  type,
  items,
  cvData,
  onUpdate,
  className,
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Sort items for education and experience by year/period (newest first)
  const sortedItems = React.useMemo(() => {
    if (type === 'education') {
      return [...items].sort((a, b) => {
        // Extract the last year from periods like "2018-2022" or just "2022"
        const getLastYear = (yearStr: string) => {
          const match = yearStr.match(/\d{4}$/);
          return match ? parseInt(match[0]) : 0;
        };
        return getLastYear(b.year) - getLastYear(a.year);
      });
    } else if (type === 'experience') {
      return [...items].sort((a, b) => {
        // For current positions (containing "Present" or "present")
        if (/present/i.test(a.period)) return -1;
        if (/present/i.test(b.period)) return 1;

        // Extract the last year from periods like "2018-2022" or just "2022"
        const getLastYear = (periodStr: string) => {
          const match = periodStr.match(/\d{4}$/);
          return match ? parseInt(match[0]) : 0;
        };
        return getLastYear(b.period) - getLastYear(a.period);
      });
    }

    return items;
  }, [items, type]);
  const handleOpenEditor = (index?: number) => {
    if (index !== undefined) {
      setEditingIndex(index);
      if (type === 'skills' || type === 'achievements') {
        setFormData(items[index] || '');
      } else {
        setFormData({ ...items[index] });
      }
    } else {
      setEditingIndex(null);
      switch (type) {
        case 'education':
          setFormData({
            degree: '',
            institution: '',
            year: '',
            description: '',
          });
          break;
        case 'experience':
          setFormData({ title: '', company: '', period: '', description: '' });
          break;
        case 'publications':
          setFormData({
            title: '',
            authors: '',
            venue: '',
            year: '',
            link: '',
          });
          break;
        case 'skills':
          setFormData('');
          break;
        case 'achievements':
          setFormData('');
          break;
        case 'references':
          setFormData({ name: '', title: '', institution: '', contact: '' });
          break;
      }
    }
    setIsEditorOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    if (type === 'skills' || type === 'achievements') {
      setFormData(value);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    const updatedCV = { ...cvData };

    if (type === 'skills' || type === 'achievements') {
      if (editingIndex !== null) {
        const newItems = [...items];
        newItems[editingIndex] = formData;
        updatedCV[type] = newItems;
      } else {
        updatedCV[type] = [...items, formData];
      }
    } else {
      if (editingIndex !== null) {
        const newItems = [...items];
        newItems[editingIndex] = formData;
        updatedCV[type] = newItems;
      } else {
        updatedCV[type] = [...items, formData];
      }
    }

    onUpdate(updatedCV);
    setIsEditorOpen(false);
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setIsDialogOpen(true); // Open the dialog
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      const updatedCV = { ...cvData };
      const newItems = [...items];
      newItems.splice(deleteIndex, 1);
      updatedCV[type] = newItems;
      onUpdate(updatedCV);
    }
    setIsDialogOpen(false); // Close the dialog
    setDeleteIndex(null);
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false); // Close the dialog
    setDeleteIndex(null);
  };

  const renderItem = (item: any) => {
    switch (type) {
      case 'education':
        return (
          <div>
            <p className='font-medium'>{item.degree}</p>
            <p className='text-gray-600 text-sm'>{item.institution}</p>
            <p className='text-gray-500 text-sm'>{item.year}</p>
          </div>
        );

      case 'experience':
        return (
          <div>
            <p className='font-medium'>{item.title}</p>
            <p className='text-gray-600 text-sm'>{item.company}</p>
            <p className='text-gray-500 text-sm'>{item.period}</p>
          </div>
        );

      case 'publications':
        return (
          <div>
            <p className='font-medium'>{item.title}</p>
            <p className='text-gray-600 text-sm'>{item.authors}</p>
            <p className='text-gray-500 text-sm'>{item.venue}</p>
            <p className='text-gray-500 text-sm'>{item.year}</p>
            {item.link && (
              <a
                href={item.link}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 text-sm hover:underline mt-1 inline-block'>
                View publication
              </a>
            )}
          </div>
        );

      case 'skills':
        return (
          <div className='flex flex-wrap gap-1'>
            {item && (
              <span className='bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded'>
                {item}
              </span>
            )}
          </div>
        );

      case 'achievements':
        return (
          <div className='flex justify-between items-start'>
            <p>{item}</p>
          </div>
        );

      case 'references':
        return (
          <div>
            <p className='font-medium'>{item.name}</p>
            <p className='text-gray-600 text-sm'>
              {item.title}, {item.institution}
            </p>
            <p className='text-gray-500 text-sm'>{item.contact}</p>
          </div>
        );

      default:
        return null;
    }
  };
  const renderFormFields = () => {
    switch (type) {
      case 'education':
        return (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='degree'>Degree</Label>
              <Input
                id='degree'
                value={formData.degree || ''}
                onChange={(e) => handleInputChange('degree', e.target.value)}
                placeholder='e.g., PhD in Computer Science'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='institution'>Institution</Label>
              <Input
                id='institution'
                value={formData.institution || ''}
                onChange={(e) =>
                  handleInputChange('institution', e.target.value)
                }
                placeholder='e.g., Stanford University'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='year'>Year</Label>
              <Input
                id='year'
                value={formData.year || ''}
                onChange={(e) => handleInputChange('year', e.target.value)}
                placeholder='e.g., 2020 or 2018-2022'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>Description (optional)</Label>
              <Textarea
                id='description'
                value={formData.description || ''}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                placeholder='Describe your education experience...'
                className='min-h-[100px]'
              />
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder='e.g., Assistant Professor'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='company'>Company/Institution</Label>
              <Input
                id='company'
                value={formData.company || ''}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder='e.g., University of Amsterdam'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='period'>Period</Label>
              <Input
                id='period'
                value={formData.period || ''}
                onChange={(e) => handleInputChange('period', e.target.value)}
                placeholder='e.g., 2018-Present'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={formData.description || ''}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                placeholder='Describe your role and responsibilities...'
                className='min-h-[100px]'
              />
            </div>
          </div>
        );

      case 'publications':
        return (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder='e.g., Advances in Academic Research'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='authors'>Authors</Label>
              <Input
                id='authors'
                value={formData.authors || ''}
                onChange={(e) => handleInputChange('authors', e.target.value)}
                placeholder='e.g., Smith, J., et al.'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='venue'>Venue/Journal</Label>
              <Input
                id='venue'
                value={formData.venue || ''}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                placeholder='e.g., Journal of Academic Research'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='year'>Year</Label>
              <Input
                id='year'
                value={formData.year || ''}
                onChange={(e) => handleInputChange('year', e.target.value)}
                placeholder='e.g., 2023'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='link'>Link (optional)</Label>
              <Input
                id='link'
                value={formData.link || ''}
                onChange={(e) => handleInputChange('link', e.target.value)}
                placeholder='e.g., https://doi.org/...'
              />
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='skill'>Skill</Label>
              <Input
                id='skill'
                value={formData || ''}
                onChange={(e) => setFormData(e.target.value)}
                placeholder='e.g., Data Analysis'
              />
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='achievement'>Achievement</Label>
              <Textarea
                id='achievement'
                value={formData || ''}
                onChange={(e) => setFormData(e.target.value)}
                placeholder='e.g., Best Paper Award at Academic Conference 2023'
                className='min-h-[100px]'
              />
            </div>
          </div>
        );

      case 'references':
        return (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder='e.g., Prof. John Doe'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder='e.g., Professor'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='institution'>Institution</Label>
              <Input
                id='institution'
                value={formData.institution || ''}
                onChange={(e) =>
                  handleInputChange('institution', e.target.value)
                }
                placeholder='e.g., Harvard University'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='contact'>Contact</Label>
              <Input
                id='contact'
                value={formData.contact || ''}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                placeholder='e.g., john.doe@harvard.edu'
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  // Function to get content for sharing the entire section
  const getSectionShareContent = () => {
    let content = `${title}\n\n`;

    switch (type) {
      case 'education':
        items.forEach((item) => {
          content += `${item.degree} at ${item.institution}, ${item.year}\n`;
        });
        break;

      case 'experience':
        items.forEach((item) => {
          content += `${item.title} at ${item.company}, ${item.period}\n`;
        });
        break;

      case 'publications':
        items.forEach((item) => {
          content += `${item.authors} (${item.year}). ${item.title}. ${item.venue}.\n`;
        });
        break;

      case 'skills':
        content += items.join(', ');
        break;

      case 'achievements':
        items.forEach((item) => {
          content += `- ${item}\n`;
        });
        break;

      case 'references':
        items.forEach((item) => {
          content += `${item.name}, ${item.title}, ${item.institution}\n`;
        });
        break;
    }

    return content;
  };

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-lg font-medium flex items-center gap-2'>
          {icon}
          <span>{title}</span>
        </CardTitle>

        <div className='flex items-center gap-2'>
          {items.length > 0 && (
            <SocialShareMenu
              compact
              title={title}
              content={getSectionShareContent()}
            />
          )}
        </div>
      </CardHeader>

      <CardContent className='flex-1 overflow-y-auto max-h-[250px]'>
        {items.length > 0 ? (
          <div className='space-y-4'>
            {items.map((item, index) => (
              <div
                key={index}
                className='pb-3 border-b border-gray-100 last:border-0'>
                <div className='flex justify-between items-center'>
                  <div className='flex-1'>{renderItem(item)}</div>
                  <div className='flex space-x-1 ml-2 self-center'>
                    <SocialShareMenu compact title='' content={item} />
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleOpenEditor(items.indexOf(item))}
                      aria-label='Edit'
                      title='Edit'>
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDelete(items.indexOf(item))}
                      aria-label='Delete'
                      title='Delete'
                      className='text-red-500 hover:text-red-700 hover:bg-red-50'>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-8 text-gray-400'>
            <p>No {type} added yet</p>
          </div>
        )}
      </CardContent>

      <CardFooter className='pt-2 flex justify-center border-t'>
        <Button
          variant='ghost'
          className='flex items-center gap-2'
          onClick={() => handleOpenEditor()}>
          <PlusCircle className='h-4 w-4' /> Add {title}
        </Button>
      </CardFooter>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? `Edit ${title}` : `Add ${title}`}
            </DialogTitle>
          </DialogHeader>

          {renderFormFields()}

          <DialogFooter className='flex justify-end space-x-2 pt-4'>
            <Button variant='outline' onClick={() => setIsEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingIndex !== null ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {title.toLowerCase()} item?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card >
  );
};

export default CVSectionCard;
