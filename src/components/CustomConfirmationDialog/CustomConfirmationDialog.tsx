'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '../ui/button';

type CustomConfirmationDialogProps = {
  title: string;
  description: string;
  actionText?: string;
  cancelText?: string;
  onAction: () => void;
  onCancel?: () => void;
};

const CustomConfirmationDialog: React.FC<
  CustomConfirmationDialogProps & { open: boolean }
> = (props) => {
  const {
    open,
    title,
    description,
    actionText,
    cancelText,
    onAction,
    onCancel,
  } = props;

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
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={'outline'} onClick={onCancel}>
            {cancelText || 'Cancel'}
          </Button>
          <Button onClick={onAction}>{actionText || 'Ok'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const useCustomConfirmationDialog = (
  props: CustomConfirmationDialogProps,
) => {
  const { onCancel } = props;
  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => {
    if (onCancel) {
      onCancel();
    }
    setIsOpen(false);
  };

  return {
    openDialog: () => {
      setIsOpen(true);
    },
    closeDialog,
    CustomConfirmationDialog: () => (
      <CustomConfirmationDialog
        {...props}
        onCancel={closeDialog}
        open={isOpen}
      />
    ),
  };
};
