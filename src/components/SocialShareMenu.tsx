import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Facebook,
  Linkedin,
  Twitter,
  Share2,
  Globe,
  Mail,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export type SocialPlatform =
  | 'facebook'
  | 'twitter'
  | 'linkedin'
  | 'email'
  | 'copy';

type SocialShareMenuProps = {
  title: string;
  content: string;
  url?: string;
  className?: string;
  compact?: boolean;
};

const SocialShareMenu: React.FC<SocialShareMenuProps> = ({
  title,
  content,
  url = window.location.href,
  className,
  compact = false,
}) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedContent = encodeURIComponent(content);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedContent}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedContent}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedContent}%0A%0A${encodedUrl}`,
  };

  const handleShare = (platform: SocialPlatform) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(`${title}\n${content}\n${url}`);
      toast.success('Copied to clipboard');
      return;
    }

    window.open(
      shareLinks[platform],
      '_blank',
      'width=600,height=400,location=0,menubar=0,toolbar=0'
    );

    toast.success(`Shared on ${platform}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size={compact ? 'sm' : 'default'}
          className={cn('flex items-center gap-1', className)}>
          <Share2 className={cn('h-4 w-4', compact ? '' : 'mr-1')} />
          {!compact && 'Share'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64 p-2'>
        <div className='space-y-2'>
          <h3 className='text-sm font-medium'>Share</h3>

          <div className='grid grid-cols-2 gap-2'>
            <Button
              variant='outline'
              className='w-full flex items-center gap-2'
              onClick={() => handleShare('facebook')}>
              <Facebook className='h-4 w-4 text-blue-600' />
              Facebook
            </Button>

            <Button
              variant='outline'
              className='w-full flex items-center gap-2'
              onClick={() => handleShare('twitter')}>
              <Twitter className='h-4 w-4 text-blue-400' />
              Twitter
            </Button>

            <Button
              variant='outline'
              className='w-full flex items-center gap-2'
              onClick={() => handleShare('linkedin')}>
              <Linkedin className='h-4 w-4 text-blue-700' />
              LinkedIn
            </Button>

            <Button
              variant='outline'
              className='w-full flex items-center gap-2'
              onClick={() => handleShare('email')}>
              <Mail className='h-4 w-4 text-gray-500' />
              Email
            </Button>

            <Button
              variant='outline'
              className='w-full col-span-2 flex items-center gap-2'
              onClick={() => handleShare('copy')}>
              <Copy className='h-4 w-4' />
              Copy to clipboard
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SocialShareMenu;
