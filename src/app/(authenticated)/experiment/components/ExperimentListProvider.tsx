'use client';
import { experimentListResponseSchema } from '@/app/api/experiment/list/schema';
import { ApiEndpoints } from '@/lib/routes/routes';
import { UUIDPrefixEnum, getUuidFromFakeId } from '@/lib/utils';
import React, { PropsWithChildren, createContext, useContext } from 'react';
import useSWR from 'swr';
import { ExperimentList, ExperimentListContextType } from '../types';

const getData = async (): Promise<ExperimentList> => {
  const response = await fetch(ApiEndpoints.experimentList, {
    method: 'GET',
  });
  const experimentList = await response.json();
  return experimentListResponseSchema
    .parse(experimentList)
    .map((experiment) => {
      return {
        ...experiment,
        id: getUuidFromFakeId(experiment.id, UUIDPrefixEnum.EXPERIMENT),
        Dataset: {
          ...experiment.Dataset,
          id: getUuidFromFakeId(experiment.Dataset.id, UUIDPrefixEnum.DATASET),
        },
      };
    });
};

// Create the context
export const ExperimentListContext = createContext<ExperimentListContextType>({
  experiments: [],
  isLoading: true,
});

export const useExperimentListContext = () => {
  const context = useContext(ExperimentListContext);
  if (!context) {
    throw new Error(
      'useDatasetRowInspectorContext must be used within a ExperimentListProvider',
    );
  }
  return context;
};

// Define the provider component
export const ExperimentListProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { data: experiments = [], isLoading } = useSWR(
    'experimentList',
    getData,
  );

  return (
    <ExperimentListContext.Provider value={{ experiments, isLoading }}>
      {children}
    </ExperimentListContext.Provider>
  );
};
