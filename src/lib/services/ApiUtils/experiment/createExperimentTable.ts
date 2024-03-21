import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';

import { createExperimentPayloadSchema } from '@/app/api/experiment/[experimentId]/insert/schema';
import DatabaseUtils from '../../DatabaseUtils';
import {
  assertExperimentExists,
  isExperimentTableCreated,
} from '../../DatabaseUtils/common';
import PrismaClient from '../../prisma';
import {
  buildExperimentColumnDefinition,
  buildExperimentFields,
} from './utils';

export async function createExperimentTable(
  payload: PayloadSchemaType[ApiEndpoints.experimentCreate],
) {
  // Don't create dynamic table if doesn't exist in the Experiments list table
  const { experimentId, outputFieldsByMetadata } =
    createExperimentPayloadSchema.parse(payload);
  await assertExperimentExists(experimentId);

  const experimentColumns = buildExperimentFields(outputFieldsByMetadata);
  const experimentFields = experimentColumns.map((field) => field.field);
  // Return if table is already created
  if (await isExperimentTableCreated(experimentId, experimentFields)) {
    return;
  }

  const columnDefinitions = buildExperimentColumnDefinition(experimentColumns);
  await DatabaseUtils.create(experimentId, columnDefinitions);

  await Promise.all(
    experimentColumns.map(
      async (field) =>
        await PrismaClient.experiment_column.create({
          data: {
            experiment_uuid: experimentId,
            name: field.name,
            field: field.field,
            type: field.type,
          },
        }),
    ),
  );
}
