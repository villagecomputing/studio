'use client';
import { experimentListResponseSchema } from '@/app/api/experiment/list/schema';
import { useToast } from '@/components/ui/use-toast';
import { ApiEndpoints } from '@/lib/routes/routes';
import {
  getDatasetUuidFromFakeId,
  getExperimentUuidFromFakeId,
} from '@/lib/utils';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { LogsList, LogsListContextType } from '../types';

const getData = async (): Promise<LogsList> => {
  // TODO Change this
  const response = await fetch(ApiEndpoints.experimentList, {
    method: 'GET',
  });
  const logsList = await response.json();
  // TODO Change this
  return experimentListResponseSchema.parse(logsList).map((logs) => {
    return {
      ...logs,
      // TODO Change this
      id: getExperimentUuidFromFakeId(logs.id),
      Dataset: {
        ...logs.Dataset,
        id: getDatasetUuidFromFakeId(logs.Dataset.id),
      },
    };
  });
};

// Create the context
export const LogsListContext = createContext<LogsListContextType>({
  logs: [],
});

export const useLogsListContext = () => {
  const context = useContext(LogsListContext);
  if (!context) {
    throw new Error(
      'useDatasetRowInspectorContext must be used within a LogsListProvider',
    );
  }
  return context;
};

// Define the provider component
export const LogsListProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [logs, setLogs] = useState<LogsList>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getData();
        setLogs(data);
      } catch (err) {
        toast({
          duration: 5000,
          variant: 'destructive',
          description: 'Error getting the logs list',
        });
      }
    };

    fetchLogs();
  }, []);

  return (
    <LogsListContext.Provider value={{ logs }}>
      {children}
    </LogsListContext.Provider>
  );
};
