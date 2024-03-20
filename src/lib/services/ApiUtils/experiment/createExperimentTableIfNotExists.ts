import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';

import { insertExperimentPayloadSchema } from '@/app/api/experiments/[experimentId]/insert/schema';
import DatabaseUtils from '../../DatabaseUtils';
import { assertExperimentExists } from '../../DatabaseUtils/common';
import PrismaClient from '../../prisma';
import {
  ExperimentField,
  buildExperimentColumnDefinition,
  buildExperimentFields,
} from './utils';

export async function isExperimentTableAlreadyCreated(
  _experimentId: string,
  _fields: ExperimentField[],
): Promise<boolean> {
  // TODO:
  throw new Error('Not implemented');
}

export async function createExperimentTable(
  experimentId: string,
  payload: PayloadSchemaType[ApiEndpoints.experimentInsert],
) {
  await assertExperimentExists(experimentId);
  const params = insertExperimentPayloadSchema.parse(payload);
  const { steps } = params;

  const outputFieldsByMetadata = steps.reduce(
    (acc: Record<string, string[]>, step) => {
      if (step.name && step.metadata) {
        acc[step.name] = step.outputs.map((output) => output.name);
      }
      return acc;
    },
    {},
  );

  const experimentFields = buildExperimentFields(outputFieldsByMetadata);
  if (await isExperimentTableAlreadyCreated(experimentId, experimentFields)) {
    return;
  }

  const columnDefinitions = buildExperimentColumnDefinition(experimentFields);
  await DatabaseUtils.create(experimentId, columnDefinitions);

  await Promise.all(
    experimentFields.map(
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
