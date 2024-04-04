'use server';
import ApiUtils from '@/lib/services/ApiUtils';
import { ParserError } from '@/lib/services/DatasetParser';
import { permanentRedirect } from 'next/navigation';

import { Enum_Experiment_Column_Type } from '@/lib/types';
import ExperimentGrid from '../utils/ExperimentGrid';
import { FetchExperimentResult } from './types';

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
