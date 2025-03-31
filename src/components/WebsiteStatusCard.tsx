import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Copy, Edit, Power, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface WebsiteStatusCardProps {
  domain: string;
  isOnline: boolean;
  onToggleStatus: () => void;
}

const WebsiteStatusCard: React.FC<WebsiteStatusCardProps> = ({
  domain,
  isOnline,
  onToggleStatus,
}) => {
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${domain}`);
    toast.success('Website URL copied to clipboard');
  };
  const handleVisitWebsite = () => {
    window.open(`https://${domain}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-lg font-medium'>
          <div className='flex items-center gap-2'>
            <Globe className='h-5 w-5 text-academic-orange' />
            <span>Website Status</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Badge
                variant={isOnline ? 'default' : 'secondary'}
                className={isOnline ? 'bg-green-500 hover:bg-green-600' : ''}>
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
              <span className='text-sm text-gray-500'>
                Last updated: {new Date().toLocaleString()}
              </span>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={onToggleStatus}
              className='flex items-center gap-1'>
              <Power className='h-3 w-3' />
              {isOnline ? 'Disable' : 'Enable'}
            </Button>
          </div>

          <div className='bg-gray-50 p-3 rounded-md flex items-center justify-between'>
            <span className='font-medium text-sm truncate'>
              https://{domain}
            </span>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0'
              onClick={handleCopyUrl}>
              <Copy className='h-4 w-4' />
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0'
              onClick={handleVisitWebsite}
              title='Visit website'
              disabled={!isOnline}>
              <ExternalLink className='h-4 w-4' />
            </Button>
          </div>

          <div className='pt-2'>
            <Link to='/website'>
              <Button className='w-full flex items-center gap-2'>
                <Edit className='h-4 w-4' /> Edit Website
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteStatusCard;
