'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { MAX_FILE_SIZE } from '@/lib/constants';
import { TOAST_MESSAGE } from '@/lib/language/toasts';
import { UploadIcon } from 'lucide-react';
import { useRef } from 'react';
import UploadDataDialog, {
  useUploadDataDialog,
} from '../upload-data-dialog/UploadDataDialog';
import { useUploadDataContext } from '../upload-data-dialog/UploadDataProvider';

const UploadDataButton = () => {
  const { toast } = useToast();
  const { isOpen, closeDialog, openDialog } = useUploadDataDialog();
  const { onFileSelected } = useUploadDataContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && fileInputRef.current) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: 'destructive',
          description: TOAST_MESSAGE.FILE_SIZE_ERROR,
        });
        return;
      }
      try {
        await onFileSelected(file);
      } catch (error) {
        toast({
          duration: 8000,
          variant: 'destructive',
          description: (error as Error).message,
        });
        return;
      }
      openDialog();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <UploadDataDialog onCancel={closeDialog} open={isOpen} />
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
