'use client';
import { Button } from '@/components/ui/button';
import { UploadIcon } from 'lucide-react';
import { useRef } from 'react';
import { useUploadDataDialog } from '../upload-data-dialog/UploadDataDialog';
import { useUploadDataContext } from '../upload-data-dialog/UploadDataProvider';

const UploadDataButton = () => {
  const { UploadDataDialog, openDialog } = useUploadDataDialog();
  const { onFileSelected } = useUploadDataContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
      openDialog();
    }
  };

  return (
    <>
      <UploadDataDialog />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".csv,.tsv"
      />
      <Button onClick={() => fileInputRef.current?.click()}>
        <UploadIcon size={15} className="mr-2.5" strokeWidth={2.5} />
        Upload Data
      </Button>
    </>
  );
};

export default UploadDataButton;
