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

    return {
      experimentName: experiment.name,
      dataset: { id: experiment.dataset.uuid, name: experiment.dataset.name },
      latencyP50: experiment.latencyP50,
      latencyP90: experiment.latencyP90,
      cost: experiment.cost,
      parameters: experiment.parameters,
      accuracy: experiment.accuracy,
      ...ExperimentGrid.convertToAGGridData({
        experimentId: experiment.uuid,
        columns: experiment.columns,
        rows: experiment.rows,
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
