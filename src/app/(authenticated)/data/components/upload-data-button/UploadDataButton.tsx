'use client';
import { Button } from '@/components/ui/button';
import { UploadIcon } from 'lucide-react';

const UploadDataButton = () => {
  return (
    <Button onClick={() => console.log('Upload Data button clicked')}>
      <UploadIcon size={15} className="mr-2.5" strokeWidth={2.5} />
      Upload Data
    </Button>
  );
};

export default UploadDataButton;
