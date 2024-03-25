import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import PrismaClient from '../../prisma';
import { getExperimentDetails } from './getExperiment';
import {
  DEFAULT_ROW_METADATA_VALUES,
  ExperimentUpdatableMetadata,
  RowMetadata,
  assertIsMetadataValid,
} from './utils';

const getUpdatedAvgLatency = (
  currentLatency: number,
  currentRowNumber: number,
  newLatency: number,
) => (currentLatency * currentRowNumber + newLatency) / (currentRowNumber + 1);

const buildRowMetadata = (
  payload: PayloadSchemaType[ApiEndpoints.experimentInsert],
): RowMetadata => {
  return payload.steps.reduce<RowMetadata>((acc, curr) => {
    assertIsMetadataValid(curr.metadata);

    return {
      row_latency_p50: acc.row_latency_p50 + Number(curr.metadata.latencyP50),
      row_latency_p90: acc.row_latency_p90 + Number(curr.metadata.latencyP90),
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
    const payloadMetadata = buildRowMetadata(payload);

    const updatedData: ExperimentUpdatableMetadata = {
      avg_latency_p50: getUpdatedAvgLatency(
        experimentDetails.avg_latency_p50,
        experimentDetails.total_rows,
        payloadMetadata.row_latency_p50,
      ),
      avg_latency_p90: getUpdatedAvgLatency(
        experimentDetails.avg_latency_p90,
        experimentDetails.total_rows,
        payloadMetadata.row_latency_p90,
      ),
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
