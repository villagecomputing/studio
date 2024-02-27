import { useRouter } from 'next/navigation';
import { AGGridDataset, DatasetTableContext } from '../types';

export const useDatasetTableContext = (
  props: AGGridDataset,
): DatasetTableContext => {
  const router = useRouter();

  return {
    refreshData: router.refresh,
    ...props,
  };
};
