import { ExperimentList } from '@/app/(authenticated)/experiment/types';
import { UseGroupSpecificDataResult } from '../types';

export const useGroupSpecificData = (
  experiments: ExperimentList,
): UseGroupSpecificDataResult => {
  const dataset = experiments[0]?.Dataset;

  return {
    datasetId: dataset?.id || '',
    datasetName: dataset?.name || '',
  };
};
