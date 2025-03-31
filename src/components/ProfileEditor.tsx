import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Camera, X, Save, Upload } from 'lucide-react';
import { type ParsedCV } from '@/types/parsed-cv';
import { toast } from 'sonner';
import { useFirebase } from '@/lib/firebase/FirebaseContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/firebase';

interface ProfileEditorProps {
  cvData: ParsedCV | null;
  onUpdate: (updatedData: ParsedCV) => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  cvData,
  onUpdate,
  open,
  onOpenChange,
}) => {
  const { currentUser } = useFirebase();
  const [name, setName] = useState(cvData?.personalInfo?.name || '');
  const [email, setEmail] = useState(cvData?.personalInfo?.email || '');
  const [phone, setPhone] = useState(cvData?.personalInfo?.phone || '');
  const [location, setLocation] = useState(
    cvData?.personalInfo?.location || ''
  );
  const [title, setTitle] = useState(cvData?.personalInfo?.title || '');
  const [summary, setSummary] = useState(cvData?.summary || '');
  const [profileImage, setProfileImage] = useState(
    cvData?.personalInfo?.image || ''
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Update state when cvData changes or dialog opens
  useEffect(() => {
    if (open && cvData) {
      setName(cvData.personalInfo?.name || '');
      setEmail(cvData.personalInfo?.email || '');
      setPhone(cvData.personalInfo?.phone || '');
      setLocation(cvData.personalInfo?.location || '');
      setTitle(cvData.personalInfo?.title || '');
      setSummary(cvData.summary || '');
      setProfileImage(cvData.personalInfo?.image || '');
    }
  }, [cvData, open]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    try {
      setUploading(true);
      const storageRef = ref(
        storage,
        `users/${currentUser.uid}/profile/${Date.now()}_${file.name}`
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setProfileImage(downloadURL);
      toast.success('Profile image uploaded successfully');
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast.error('Failed to upload profile image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!cvData) {
      toast.error('No CV data available to update');
      return;
    }

    const updatedCV: ParsedCV = {
      ...cvData,
      personalInfo: {
        ...(cvData.personalInfo || {}),
        name,
        email,
        phone,
        location,
        title,
        image: profileImage,
      },
      summary,
    };

    try {
      await onUpdate(updatedCV);
      onOpenChange(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Profile Image Upload */}
          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <Avatar className='h-32 w-32 border-2 border-gray-200'>
                <AvatarImage src={profileImage} alt='Profile' />
                <AvatarFallback className='text-2xl bg-orange-100 text-academic-orange'>
                  {name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>

              <Button
                size='icon'
                variant='secondary'
                className='absolute bottom-0 right-0 rounded-full h-8 w-8'
                onClick={handleUploadClick}
                disabled={uploading}>
                {uploading ? (
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-600' />
                ) : (
                  <Camera className='h-4 w-4' />
                )}
              </Button>

              <input
                type='file'
                ref={fileInputRef}
                className='hidden'
                accept='image/*'
                onChange={handleFileChange}
              />
            </div>

            {profileImage && (
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2'
                onClick={() => setProfileImage('')}>
                <X className='h-4 w-4' /> Remove Image
              </Button>
            )}
          </div>

          {/* Personal Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Enter your full name'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='title'>Professional Title</Label>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g., Associate Professor'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='your.email@example.com'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phone'>Phone</Label>
              <Input
                id='phone'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='+1 (123) 456-7890'
              />
            </div>

            <div className='space-y-2 md:col-span-2'>
              <Label htmlFor='location'>Location</Label>
              <Input
                id='location'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder='City, Country'
              />
            </div>
          </div>

          {/* Summary */}
          <div className='space-y-2'>
            <Label htmlFor='summary'>Professional Summary</Label>
            <Textarea
              id='summary'
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder='Write a brief summary of your professional background and research interests...'
              className='min-h-[120px]'
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className='flex items-center gap-2'>
            <Save className='h-4 w-4' /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditor;
