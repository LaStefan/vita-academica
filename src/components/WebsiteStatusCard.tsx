import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Globe,
  Copy,
  Edit,
  Power,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export type WebsiteStatus = 'online' | 'offline' | 'publishing' | 'unpublishing';

interface WebsiteStatusCardProps {
  domain: string;
  status: WebsiteStatus;
  lastUpdated: string;
  onToggleStatus: () => void;
  showEditButton?: boolean;
}

const WebsiteStatusCard: React.FC<WebsiteStatusCardProps> = ({
  domain,
  status,
  lastUpdated,
  onToggleStatus,
  showEditButton = false,
}) => {
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${domain}.web.app`);
    toast.success('Website URL copied to clipboard');
  };

  const handleVisitWebsite = () => {
    window.open(`https://${domain}.web.app`, '_blank', 'noopener,noreferrer');
  };

  const renderBadge = () => {
    if (status === 'online') {
      return (
        <Badge className='bg-green-500 hover:bg-green-600'>Online</Badge>
      );
    } else if (status === 'publishing' || status === 'unpublishing') {
      return (
        <Badge className='bg-yellow-500 hover:bg-yellow-600'>
          {status === 'publishing' ? 'Publishing...' : 'Unpublishing...'}
        </Badge>
      );
    } else {
      return (
        <Badge className='bg-gray-400 hover:bg-gray-500'>Offline</Badge>
      );
    }
  };

  const renderToggleButton = () => {
    const isLoading = status === 'publishing' || status === 'unpublishing';

    return (
      <Button
        variant={isLoading ? 'ghost' : 'outline'}
        size='sm'
        disabled={isLoading}
        onClick={onToggleStatus}
        className='flex items-center gap-1'>
        {isLoading ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <>
            <Power className='h-3 w-3' />
            {status === 'online' ? 'Disable' : 'Enable'}
          </>
        )}
      </Button>
    );
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
              {renderBadge()}
              <span className='text-sm text-gray-500'>
                Last updated: {lastUpdated}
              </span>
            </div>
            {renderToggleButton()}
          </div>

          <div className='bg-gray-50 p-3 rounded-md flex items-center justify-between'>
            <span className='font-medium text-sm truncate'>
              https://{domain}.web.app
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
              disabled={status !== 'online'}>
              <ExternalLink className='h-4 w-4' />
            </Button>
          </div>

          {showEditButton && (
            <div className='pt-2'>
              <Link to='/website'>
                <Button className='w-full flex items-center gap-2'>
                  <Edit className='h-4 w-4' /> Edit Website
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteStatusCard;
