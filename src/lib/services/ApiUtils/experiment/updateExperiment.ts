import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import PrismaClient from '../../prisma';

import { ExperimentStep } from '@/app/api/experiment/[experimentId]/insert/schema';
import { getExperimentDetails } from './getExperimentDetails';
import {
  DEFAULT_ROW_METADATA_VALUES,
  Enum_Dynamic_experiment_metadata_fields,
  ExperimentUpdatableMetadata,
  RowMetadata,
  calculatePercentile,
  getOrderedExperimentMetadata,
} from './utils';

export const buildRowMetadata = (steps: ExperimentStep[]): RowMetadata => {
  return steps.reduce<RowMetadata>((acc, curr) => {
    return {
      row_latency: acc.row_latency + Number(curr.metadata.latency),
      row_cost:
        acc.row_cost +
        Number(curr.metadata.input_cost ?? 0) +
        Number(curr.metadata.output_cost ?? 0),
    };
  }, DEFAULT_ROW_METADATA_VALUES);
};

export async function updateExperiment({
  experimentId,
  payload,
  userId,
}: {
  experimentId: string;
  payload: PayloadSchemaType[ApiEndpoints.experimentInsert];
  userId: string | null;
}) {
  try {
    const experimentDetails = await getExperimentDetails(experimentId, userId);
    if (userId && !experimentDetails) {
      throw new Error('Invalid experiment id');
    }
    const experimentLatencies = await getOrderedExperimentMetadata(
      experimentId,
      Enum_Dynamic_experiment_metadata_fields.LATENCY,
    );
    const payloadMetadata = buildRowMetadata(payload.steps);

    const updatedData: ExperimentUpdatableMetadata = {
      latency_p50: calculatePercentile(experimentLatencies, 50),
      latency_p90: calculatePercentile(experimentLatencies, 90),
      total_latency:
        experimentDetails.total_latency + payloadMetadata.row_latency,
      total_cost: experimentDetails.total_cost + payloadMetadata.row_cost,
      total_accuracy:
        experimentDetails.total_accuracy + (payload.accuracy ?? 0),
      total_rows: experimentDetails.total_rows + 1,
    };

    const result = await PrismaClient.experiment.update({
      where: { uuid: experimentId },
      data: updatedData,
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error inserting data');
  }
}
