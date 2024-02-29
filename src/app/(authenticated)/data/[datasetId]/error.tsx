'use client';

import { useToast } from '@/components/ui/use-toast';
import { permanentRedirect } from 'next/navigation';
import { useEffect } from 'react';

const ErrorHandler = ({ error }: { error: Error & { digest?: string } }) => {
  const { toast } = useToast();
  useEffect(() => {
    toast({
      duration: 8000,
      variant: 'destructive',
      description: error.message,
    });
    permanentRedirect('/data');
  }, [error, toast]);
  return null;
};
export default ErrorHandler;
