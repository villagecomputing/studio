'use server';
import ApiUtils from '@/lib/services/ApiUtils';
import { ParserError } from '@/lib/services/DatasetParser';
import { permanentRedirect } from 'next/navigation';

import ExperimentGrid from '../utils/ExperimentGrid';
import { FetchExperimentResult } from './types';

export const fetchExperiment = async (
  experimentId: string,
): Promise<FetchExperimentResult | null> => {
  try {
    if (!experimentId) {
      permanentRedirect('/experiments');
    }
    const experiment = await ApiUtils.getExperiment(experimentId);

    return {
      experimentName: experiment.name,
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
