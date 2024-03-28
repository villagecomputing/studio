import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import PrismaClient from '../../prisma';

import { getExperimentDetails } from './getExperimentDetails';
import getOrderedExperimentLatencies from './getOrderedExperimentLatencies';
import {
  DEFAULT_ROW_METADATA_VALUES,
  ExperimentUpdatableMetadata,
  RowMetadata,
  assertIsMetadataValid,
  calculatePercentile,
} from './utils';

const buildRowMetadata = (
  payload: PayloadSchemaType[ApiEndpoints.experimentInsert],
): RowMetadata => {
  return payload.steps.reduce<RowMetadata>((acc, curr) => {
    assertIsMetadataValid(curr.metadata);

    return {
      row_latency: acc.row_latency + Number(curr.metadata.latency),
      row_cost: acc.row_cost + Number(curr.metadata.cost),
      row_accuracy: acc.row_accuracy + Number(curr.metadata.accuracy),
    };
  }, DEFAULT_ROW_METADATA_VALUES);
};

export async function updateExperiment(
  experimentId: string,
  payload: PayloadSchemaType[ApiEndpoints.experimentInsert],
) {
  try {
    const experimentDetails = await getExperimentDetails(experimentId);
    const experimentLatencies =
      await getOrderedExperimentLatencies(experimentId);
    const payloadMetadata = buildRowMetadata(payload);

    const updatedData: ExperimentUpdatableMetadata = {
      latency_p50: calculatePercentile(experimentLatencies, 50),
      latency_p90: calculatePercentile(experimentLatencies, 90),
      total_latency:
        experimentDetails.total_latency + payloadMetadata.row_latency,
      total_cost: experimentDetails.total_cost + payloadMetadata.row_cost,
      total_accuracy:
        experimentDetails.total_accuracy + payloadMetadata.row_accuracy,
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
