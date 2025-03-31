import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type PlatformType = 'orcid' | 'googleScholar' | 'pure';

type AcademicIntegrationButtonProps = {
  platform: PlatformType;
  icon: React.ReactNode;
  label: string;
};

const getPlatformDetails = (platform: PlatformType) => {
  switch (platform) {
    case 'orcid':
      return {
        title: 'Connect with ORCID',
        description:
          'Link your ORCID profile to automatically import your publications and credentials.',
        idPlaceholder: 'Your ORCID ID (e.g., 0000-0000-0000-0000)',
        buttonText: 'Connect ORCID',
      };
    case 'googleScholar':
      return {
        title: 'Connect with Google Scholar',
        description:
          'Import your publications and citation metrics from Google Scholar.',
        idPlaceholder: 'Your Google Scholar profile ID',
        buttonText: 'Connect Google Scholar',
      };
    case 'pure':
      return {
        title: 'Connect with Pure',
        description:
          'Connect to your institutional Pure profile to import research outputs and activities.',
        idPlaceholder: 'Your Pure profile ID or institutional email',
        buttonText: 'Connect Pure',
      };
  }
};

const AcademicIntegrationButton: React.FC<AcademicIntegrationButtonProps> = ({
  platform,
  icon,
  label,
}) => {
  const [profileId, setProfileId] = React.useState('');
  const platformDetails = getPlatformDetails(platform);

  const handleConnect = () => {
    // Mock integration - in a real app, this would connect to the respective API
    console.log(`Connecting to ${platform} with ID: ${profileId}`);
    toast.success(`Connected to ${label} successfully!`);

    // In production, this would handle OAuth flow or API connection
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full justify-start'>
          {icon}
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{platformDetails.title}</DialogTitle>
          <DialogDescription>{platformDetails.description}</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='profile-id'>Profile ID</Label>
            <Input
              id='profile-id'
              placeholder={platformDetails.idPlaceholder}
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleConnect} disabled={!profileId}>
            {platformDetails.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AcademicIntegrationButton;
