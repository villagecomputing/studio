'use client';
import { logsListResponseSchema } from '@/app/api/logs/list/schema';
import { useToast } from '@/components/ui/use-toast';
import { ApiEndpoints } from '@/lib/routes/routes';
import { UUIDPrefixEnum, getUuidFromFakeId } from '@/lib/utils';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { LogsList, LogsListContextType } from '../types';

const getData = async (): Promise<LogsList> => {
  const response = await fetch(ApiEndpoints.logsList, {
    method: 'GET',
  });
  const logsList = await response.json();
  return logsListResponseSchema.parse(logsList).map((logs) => {
    return {
      ...logs,
      id: getUuidFromFakeId(logs.id, UUIDPrefixEnum.LOGS),
      Dataset: {
        ...logs,
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
    const fetchLogsList = async () => {
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

    fetchLogsList();
  }, []);

  return (
    <LogsListContext.Provider value={{ logs }}>
      {children}
    </LogsListContext.Provider>
  );
};
