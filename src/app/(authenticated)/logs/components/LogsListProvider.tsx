'use client';
import { logsListResponseSchema } from '@/app/api/logs/list/schema';
import { ApiEndpoints } from '@/lib/routes/routes';
import { UUIDPrefixEnum, getUuidFromFakeId } from '@/lib/utils';
import React, { PropsWithChildren, createContext, useContext } from 'react';
import useSWR from 'swr';
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
  isLoading: true,
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
  const { data: logs = [], isLoading } = useSWR('logsList', getData);

  return (
    <LogsListContext.Provider value={{ logs, isLoading }}>
      {children}
    </LogsListContext.Provider>
  );
};
