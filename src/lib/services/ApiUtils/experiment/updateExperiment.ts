import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import PrismaClient from '../../prisma';
import { getExperimentDetails } from './getExperiment';
import {
  DEFAULT_ROW_METADATA_VALUES,
  ExperimentUpdatableMetadata,
  RowMetadata,
} from './utils';

const getUpdatedAvgLatency = (
  existingLatency: number,
  existingRowNumber: number,
  newLatency: number,
) =>
  (existingLatency * existingRowNumber + newLatency) / (existingRowNumber + 1);

export async function updateExperiment(
  experimentId: string,
  payload: PayloadSchemaType[ApiEndpoints.experimentInsert],
) {
  try {
    const experimentDetails = await getExperimentDetails(experimentId);

    const payloadMetadata: RowMetadata = payload.steps.reduce<RowMetadata>(
      (acc, cur) => {
        return {
          row_latency_p50:
            acc.row_latency_p50 + (Number(cur.metadata.latencyP50) || 0),
          row_latency_p90:
            acc.row_latency_p90 + (Number(cur.metadata.latencyP90) || 0),
          row_latency: acc.row_latency + (Number(cur.metadata.latency) || 0),
          row_cost: acc.row_cost + (Number(cur.metadata.cost) || 0),
          row_accuracy: acc.row_accuracy + (Number(cur.metadata.accuracy) || 0),
        };
      },
      DEFAULT_ROW_METADATA_VALUES,
    );

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
