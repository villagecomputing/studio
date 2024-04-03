import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
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

export async function ensureExperimentTable({
  experimentId,
  payload,
}: {
  experimentId: string;
  payload: PayloadSchemaType[ApiEndpoints.experimentInsert];
}) {
  // Don't create dynamic table if doesn't exist in the Experiments list table
  await assertExperimentExists(experimentId);
  const experimentFields = buildExperimentFields(payload);
  const fields = experimentFields.map(
    (experimentField) => experimentField.field,
  );

  // Create table if it does not exist
  if (await isExperimentTableCreated(experimentId, fields)) {
    return experimentFields;
  }

  const columnDefinitions = buildExperimentColumnDefinition(experimentFields);
  await DatabaseUtils.create(experimentId, columnDefinitions);
  for (const field of experimentFields) {
    await PrismaClient.experiment_column.create({
      data: {
        experiment_uuid: experimentId,
        name: field.name,
        field: field.field,
        type: field.type,
      },
    });
  }
}
