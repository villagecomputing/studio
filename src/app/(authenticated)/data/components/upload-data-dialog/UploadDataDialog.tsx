'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Data</DialogTitle>
        </DialogHeader>
        <UploadDataDialogContent onCancel={onCancel} />
      </DialogContent>
    </Dialog>
  );
};

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
    UploadDataDialog: () =>
      isOpen ? (
        <UploadDataDialog onCancel={closeDialog} open={isOpen} />
      ) : (
        <></>
      ),
  };
};
