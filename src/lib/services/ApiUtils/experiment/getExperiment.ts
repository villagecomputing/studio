import { ExperimentTableColumnProps } from '@/app/(authenticated)/experiment/[experimentId]/types';
import { DISPLAYABLE_EXPERIMENT_COLUMN_TYPES } from '@/lib/constants';
import { ResultSchemaType } from '@/lib/routes/routes';
import { guardStringEnum } from '@/lib/typeUtils';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import getExperimentContent from './getExperimentContent';
import { getExperimentDetails } from './getExperimentDetails';

export async function getExperiment(
  experimentId: string,
): Promise<ResultSchemaType['/api/experiment']> {
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
  const columns = experimentDetails.Experiment_column.filter((column) =>
    DISPLAYABLE_EXPERIMENT_COLUMN_TYPES.includes(
      guardStringEnum(Enum_Experiment_Column_Type, column.type),
    ),
  ).map((column): ExperimentTableColumnProps => {
    return {
      name: column.name,
      id: column.id,
      field: column.field,
      type: guardStringEnum(Enum_Experiment_Column_Type, column.type),
    };
  });

  return {
    uuid: experimentDetails.uuid,
    name: experimentDetails.name,
    description: experimentDetails.description || '',
    latencyP50: experimentDetails.latency_p50,
    latencyP90: experimentDetails.latency_p90,
    runtime: experimentDetails.total_latency,
    cost: experimentDetails.total_cost,
    accuracy: experimentDetails.total_accuracy,
    dataset: experimentDetails.Dataset,
    parameters: experimentDetails.pipeline_metadata,
    created_at: experimentDetails.created_at,
    columns: columns,
    rows: experimentContent,
  };
}
