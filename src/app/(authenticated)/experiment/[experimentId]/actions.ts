'use server';
import ApiUtils from '@/lib/services/ApiUtils';
import { ParserError } from '@/lib/services/DatasetParser';
import { permanentRedirect } from 'next/navigation';

import { experimentStepMetadata } from '@/app/api/experiment/[experimentId]/insert/schema';
import { calculatePercentile } from '@/lib/services/ApiUtils/experiment/utils';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import { compact } from 'lodash';
import ExperimentGrid from '../utils/ExperimentGrid';
import {
  FetchExperimentResult,
  StepMetadataColumn,
  StepsMetadataPercentiles,
} from './types';

export const fetchExperiment = async (
  experimentId: string,
): Promise<FetchExperimentResult> => {
  try {
    if (!experimentId) {
      permanentRedirect('/experiments');
    }
    const experiment = await ApiUtils.getExperiment(experimentId);
    const dataset = await ApiUtils.getDataset(experiment.dataset.id);
    const metadataColumn = {
      field: 'metadata',
      name: 'Metadata',
      id: -1,
      type: Enum_Experiment_Column_Type.ROW_METADATA,
    };

    const stepMetadataColumns = experiment.columns.filter(
      (column) => column.type === Enum_Experiment_Column_Type.STEP_METADATA,
    );
    const stepsMetadataPercentiles = getStepsMetadataPercentiles(
      stepMetadataColumns,
      experiment.rows,
    );
    return {
      experimentName: experiment.name,
      dataset: experiment.dataset,
      latencyP50: experiment.latencyP50,
      latencyP90: experiment.latencyP90,
      latencyP25: experiment.latencyP25,
      latencyP75: experiment.latencyP75,
      runtime: experiment.runtime,
      cost: experiment.cost,
      costP25: experiment.costP25,
      costP75: experiment.costP75,
      parameters: experiment.parameters,
      accuracy: experiment.accuracy,
      stepsMetadataPercentiles,
      ...ExperimentGrid.convertToAGGridData({
        experimentId: experiment.id,
        columns: [...dataset.columns, metadataColumn, ...experiment.columns],
        rows: experiment.rows.map((row, index) => ({
          ...row,
          ...dataset.rows[index],
        })),
      }),
    };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error((error as ParserError).message);
  }
};

const getStepsMetadataPercentiles = (
  stepMetadataColumns: StepMetadataColumn[],
  rows: Record<string, string>[],
) => {
  const stepsMetadataPercentiles: StepsMetadataPercentiles = {};
  stepMetadataColumns.forEach((column) => {
    const stepMetadata = compact(
      rows.map((row) => {
        const metadata = JSON.parse(row[column.field]);
        const { latency, input_cost, output_cost, success } =
          experimentStepMetadata.parse(metadata);
        return success
          ? { latency, cost: (input_cost ?? 0) + (output_cost ?? 0) }
          : null;
      }),
    );
    const sortedLatency = stepMetadata
      .map((rowMetadata) => rowMetadata.latency)
      .sort((a, b) => a - b);

    const sortedCost = stepMetadata
      .map((rowMetadata) => rowMetadata.cost)
      .sort((a, b) => a - b);

    stepsMetadataPercentiles[column.field] = {
      costP25: calculatePercentile(sortedCost, 25),
      costP75: calculatePercentile(sortedCost, 75),
      latencyP25: calculatePercentile(sortedLatency, 25),
      latencyP75: calculatePercentile(sortedLatency, 75),
    };
  });

  return stepsMetadataPercentiles;
};
