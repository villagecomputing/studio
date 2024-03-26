import { ExperimentList } from '@/app/(authenticated)/experiment/types';
import {
  ArrowLeftRightIcon,
  CircleDollarSignIcon,
  CrosshairIcon,
} from 'lucide-react';
import { useMemo } from 'react';
import { GroupMetaInfo, UseGroupSpecificDataResult } from '../types';

export const useGroupSpecificData = (
  experiments: ExperimentList,
): UseGroupSpecificDataResult => {
  const dataset = experiments[0]?.Dataset;

  // TODO Finalize this
  const meta: GroupMetaInfo = useMemo(
    () => [
      {
        title: 'Avg. Cost',
        icon: (
          <span className="rounded-xl bg-lightGreen p-1">
            <CircleDollarSignIcon />
          </span>
        ),
        value: '$0.001',
      },
      {
        title: 'Avg. Latency',
        icon: (
          <span className="rounded-xl bg-lightGreen p-1">
            <ArrowLeftRightIcon />
          </span>
        ),
        value: '1.82s',
      },
      {
        title: 'Accuracy',
        icon: (
          <span className="rounded-xl bg-lightGreen p-1">
            <CrosshairIcon />
          </span>
        ),
        value: '82,24%',
      },
      {
        title: 'Avg. Runtime',
        value: '5m 32s',
      },
    ],
    [],
  );

  return {
    datasetId: dataset?.id || '',
    datasetName: dataset?.name || '',
    meta,
  };
};
