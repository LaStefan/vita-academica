import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Database, Share2 } from 'lucide-react';
import AcademicIntegrationButton from './AcademicIntegrationButton';

const AcademicIntegrations: React.FC = () => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-lg font-medium'>
          Academic Integrations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          <AcademicIntegrationButton
            platform='orcid'
            icon={<Database className='mr-2 h-4 w-4' />}
            label='Connect with ORCID'
          />

          <AcademicIntegrationButton
            platform='googleScholar'
            icon={<Database className='mr-2 h-4 w-4' />}
            label='Connect with Google Scholar'
          />

          <AcademicIntegrationButton
            platform='pure'
            icon={<Database className='mr-2 h-4 w-4' />}
            label='Connect with Pure'
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AcademicIntegrations;
