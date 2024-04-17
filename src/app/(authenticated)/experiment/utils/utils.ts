import { calculatePercentile } from '@/lib/services/ApiUtils/experiment/utils';
import { Record } from '@prisma/client/runtime/library';
import { ExperimentsMetadataColumnsPercentiles } from '../../group/[groupId]/types';
import { ExperimentList } from '../types';

export const getExperimentsMetadataColumnsPercentiles = (
  experiments: ExperimentList,
): ExperimentsMetadataColumnsPercentiles => {
  const avgCostColumn = experiments
    .map((experiment) =>
      experiment.totalRows ? experiment.totalCost / experiment.totalRows : null,
    )
    .filter((e): e is number => e !== null)
    .sort((a, b) => a - b);
  const avgAccuracyColumn = experiments
    .map((experiment) => (experiment.totalRows ? experiment.avgAccuracy : null))
    .filter((e): e is number => e !== null)
    .sort((a, b) => a - b);
  const avgLatencyP50Column = experiments
    .map((experiment) => (experiment.totalRows ? experiment.latencyP50 : null))
    .filter((e): e is number => e !== null)
    .sort((a, b) => a - b);
  const avgLatencyP90Column = experiments
    .map((experiment) => (experiment.totalRows ? experiment.latencyP90 : null))
    .filter((e): e is number => e !== null)
    .sort((a, b) => a - b);

  const avgCostColumnP25 = calculatePercentile(avgCostColumn, 25);
  const avgCostColumnP75 = calculatePercentile(avgCostColumn, 75);
  const avgAccuracyColumnP25 = calculatePercentile(avgAccuracyColumn, 25);
  const avgAccuracyColumnP75 = calculatePercentile(avgAccuracyColumn, 75);
  const latencyP50ColumnP25 = calculatePercentile(avgLatencyP50Column, 25);
  const latencyP50ColumnP75 = calculatePercentile(avgLatencyP50Column, 75);
  const latencyP90ColumnP25 = calculatePercentile(avgLatencyP90Column, 25);
  const latencyP90ColumnP75 = calculatePercentile(avgLatencyP90Column, 75);
  return {
    avgCostColumnP25,
    avgCostColumnP75,
    avgAccuracyColumnP25,
    avgAccuracyColumnP75,
    latencyP50ColumnP25,
    latencyP50ColumnP75,
    latencyP90ColumnP25,
    latencyP90ColumnP75,
  };
};

export const parsePipelineParameters = (
  pipelineParameters: string,
): Record<string, string>[] => {
  const parsedParameters = JSON.parse(pipelineParameters);

  const result = Object.entries(parsedParameters).flatMap(([step, details]) => {
    return Object.entries(details as object).flatMap(([key, value]) => ({
      [`${step}_${key}`]:
        typeof value === 'object' ? JSON.stringify(value) : value.toString(),
    }));
  });
  return result;
};
