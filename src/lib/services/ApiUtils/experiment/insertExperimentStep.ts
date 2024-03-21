import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';

import { insertExperimentPayloadSchema } from '@/app/api/experiment/[experimentId]/insert/schema';
import { UPDATABLE_EXPERIMENT_COLUMN_TYPES } from '@/lib/constants';
import DatabaseUtils from '../../DatabaseUtils';
import PrismaClient from '../../prisma';
import { getMetadataSpecificOutputName } from './utils';

export async function insertExperimentSteps(
  experimentId: string,
  payload: PayloadSchemaType[ApiEndpoints.experimentInsert],
) {
  const { steps } = insertExperimentPayloadSchema.parse(payload);
  const fieldValues: Record<string, string> = {};
  steps.forEach((step) => {
    fieldValues[step.name] = JSON.stringify(step.metadata);

    step.outputs.forEach((output) => {
      fieldValues[getMetadataSpecificOutputName(step.name, output.name)] =
        output.value;
    });
  });
  try {
    // Get all fields and column names associated with the dataset
    const existingColumns = await PrismaClient.experiment_column.findMany({
      select: {
        name: true,
        field: true,
      },
      where: {
        experiment_uuid: experimentId,
        type: {
          in: UPDATABLE_EXPERIMENT_COLUMN_TYPES,
        },
      },
    });

    const sanitizedSteps: Record<string, string> = {};
    existingColumns.forEach((existingColumn) => {
      sanitizedSteps[existingColumn.field] =
        fieldValues[existingColumn.name] || '';
    });

    const result = await DatabaseUtils.insert(experimentId, [sanitizedSteps]);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error inserting data');
  }
}
