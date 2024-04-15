'use client';
import Loading from '@/components/loading/Loading';
import { useToast } from '@/components/ui/use-toast';
import { API_KEY_REFETCH_INTERVAL_MS } from '@/lib/constants';
import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchUserApiKey } from './actions';

// const getApiKey = async (userId: string) => {
//   const response = await fetch(`/api/user/${userId}/getApiKey`, {
//     method: 'GET',
//   });
//   const body = await response.json();
//   return userGetApiKeyResponseSchema.parse(body).api_key;
// };

export type ApiManagementProps = {
  params: {
    userId: string;
  };
};

export default function ApiManagement(props: ApiManagementProps) {
  const {
    data: apiKey,
    error,
    isLoading,
  } = useSWR(props.params.userId, fetchUserApiKey, {
    refreshInterval: API_KEY_REFETCH_INTERVAL_MS,
  });
  const { toast } = useToast();
  // const apiKey = await fetchUserApiKey(props.params.userId);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (error) {
      toast({
        value: 'Failed to get API key',
        variant: 'destructive',
      });
      console.error(error);
    }
  }, [isLoading, error]);

  if (!apiKey) {
    return <Loading />;
  }

  return <div>API key: {apiKey}</div>;
}
