'use client';
import { experimentListResponseSchema } from '@/app/api/experiment/list/schema';
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
  const [experiments, setExperiments] = useState<ExperimentList>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const data = await getData();
        setExperiments(data);
      } catch (err) {
        toast({
          duration: 5000,
          variant: 'destructive',
          description: 'Error getting the experiments list',
        });
      }
    };

    fetchExperiments();
  }, []);

  return (
    <ExperimentListContext.Provider value={{ experiments }}>
      {children}
    </ExperimentListContext.Provider>
  );
};
