'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React, { useState } from 'react';
import UploadDataDialogContent from './components/UploadDataDialogContent';
import { UploadDataDialogProps } from './types';

const UploadDataDialog: React.FC<UploadDataDialogProps> = (props) => {
  const { open, onCancel } = props;

  return (
    <Dialog
      defaultOpen={false}
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && onCancel) {
          onCancel();
        }
      }}
    >
      <DialogContent
        className="flex max-h-[96vh] flex-col"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Upload Data</DialogTitle>
        </DialogHeader>
        <UploadDataDialogContent onCancel={onCancel} />
      </DialogContent>
    </Dialog>
  );
};
export default React.memo(UploadDataDialog);
export const useUploadDataDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
  };

  return {
    openDialog: () => {
      setIsOpen(true);
    },
    closeDialog,
    isOpen,
  };
};
