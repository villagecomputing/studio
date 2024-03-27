import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import PrismaClient from '../../prisma';
import {
  getExperimentDetails,
  getOrderedExperimentLatencies,
} from './getExperiment';
import {
  DEFAULT_ROW_METADATA_VALUES,
  ExperimentUpdatableMetadata,
  RowMetadata,
  assertIsMetadataValid,
} from './utils';

export default function calculatePercentile(
  data: number[],
  percentile: number,
) {
  // Step 1: Sort the dataset in ascending order
  const sortedData = data.sort((a, b) => a - b);

  // Step 2: Calculate the position of the percentile
  const position = (percentile / 100) * (sortedData.length + 1);

  // Step 3: Check if position is an integer
  if (Number.isInteger(position)) {
    // If position is an integer, return the value at that position
    return sortedData[position - 1];
  } else {
    // If position is not an integer, interpolate between the values at the nearest ranked positions
    const lowerIndex = Math.floor(position);
    const upperIndex = Math.ceil(position);
    const lowerValue = sortedData[lowerIndex - 1];
    const upperValue = sortedData[upperIndex - 1];
    return lowerValue + (upperValue - lowerValue) * (position - lowerIndex);
  }
}

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
