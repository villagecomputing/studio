import { ExperimentTableColumnProps } from '@/app/(authenticated)/experiment/[experimentId]/types';
import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';
import { guardStringEnum } from '@/lib/typeUtils';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import DatabaseUtils from '../../DatabaseUtils';
import getExperimentContent from './getExperimentContent';
import { getExperimentDetails } from './getExperimentDetails';
import {
  Enum_Dynamic_experiment_metadata_fields,
  calculatePercentile,
  getOrderedExperimentMetadata,
} from './utils';

export async function getExperiment(
  experimentId: string,
): Promise<ResultSchemaType[ApiEndpoints.experimentView]> {
  if (!experimentId) {
    throw new Error('experimentId is required');
  }

  const experimentDetails = await getExperimentDetails(experimentId);
  if (!experimentDetails) {
    throw new Error('No experiment for id');
  }

  // Get database experiment content
  const experimentContent = await getExperimentContent(experimentId);

  // Map the columns
  const columns = experimentDetails.Experiment_column.map(
    (column): ExperimentTableColumnProps => {
      return {
        name: column.name,
        id: column.id,
        field: column.field,
        type: guardStringEnum(Enum_Experiment_Column_Type, column.type),
      };
    },
  );

  const orderedCosts = await getOrderedExperimentMetadata(
    experimentId,
    Enum_Dynamic_experiment_metadata_fields.COST,
  );
  const orderedLatencies = await getOrderedExperimentMetadata(
    experimentId,
    Enum_Dynamic_experiment_metadata_fields.LATENCY,
  );
  const costP25 = calculatePercentile(orderedCosts, 25);
  const costP75 = calculatePercentile(orderedCosts, 75);
  const latencyP25 = calculatePercentile(orderedLatencies, 25);
  const latencyP75 = calculatePercentile(orderedLatencies, 75);
  let rowsWithAccuracyCount = 0;
  try {
    rowsWithAccuracyCount = Number(
      await DatabaseUtils.selectAggregation(
        experimentId,
        { func: 'COUNT' },
        { accuracy: { isNotNull: true } },
      ),
    );
  } catch (_e) {}

  return {
    id: experimentDetails.uuid,
    name: experimentDetails.name,
    description: experimentDetails.description || '',
    latencyP50: experimentDetails.latency_p50,
    latencyP90: experimentDetails.latency_p90,
    runtime: experimentDetails.total_latency,
    cost: experimentDetails.total_cost,
    accuracy: rowsWithAccuracyCount
      ? experimentDetails.total_accuracy / rowsWithAccuracyCount
      : 0,
    dataset: {
      ...experimentDetails.Dataset,
      id: experimentDetails.Dataset.uuid,
    },
    parameters: experimentDetails.pipeline_metadata,
    created_at: experimentDetails.created_at,
    columns: columns,
    rows: experimentContent,
    costP25,
    costP75,
    latencyP25,
    latencyP75,
  };
}
