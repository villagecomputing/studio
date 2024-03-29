'use server';
import ApiUtils from '@/lib/services/ApiUtils';
import { ParserError } from '@/lib/services/DatasetParser';
import { permanentRedirect } from 'next/navigation';

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
    const dataset = await ApiUtils.getDataset(experiment.dataset.uuid);

    return {
      experimentName: experiment.name,
      dataset: { id: experiment.dataset.uuid, name: experiment.dataset.name },
      latencyP50: experiment.latencyP50,
      latencyP90: experiment.latencyP90,
      runtime: experiment.runtime,
      cost: experiment.cost,
      parameters: experiment.parameters,
      accuracy: experiment.accuracy,
      ...ExperimentGrid.convertToAGGridData({
        experimentId: experiment.uuid,
        columns: [...dataset.columns, ...experiment.columns],
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
