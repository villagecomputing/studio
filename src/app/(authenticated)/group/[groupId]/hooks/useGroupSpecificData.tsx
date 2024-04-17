import { ExperimentList } from '@/app/(authenticated)/experiment/types';
import { UseGroupSpecificDataResult } from '../types';

export const useGroupSpecificData = (
  experiments: ExperimentList,
): UseGroupSpecificDataResult => {
  const dataset = experiments[0]?.Dataset;
  const description = experiments[0]?.description;

  return {
    datasetId: dataset?.id || '',
    datasetName: dataset?.name || '',
    description,
  };
};
