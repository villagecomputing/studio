import { arrayContainsArray } from '@/lib/utils';
import PrismaClient from '../prisma';

export async function assertTableExists(tableName: string) {
  await PrismaClient.dataset.findUniqueOrThrow({
    where: {
      uuid: tableName,
    },
  });
}

export async function assertDatasetExists(datasetId: string) {
  await PrismaClient.dataset.findUniqueOrThrow({
    where: {
      uuid: datasetId,
    },
  });
}

export async function assertExperimentExists(experimentId: string) {
  await PrismaClient.experiment.findUniqueOrThrow({
    where: {
      uuid: experimentId,
    },
  });
}

// ATM Experiment_column table is considered source of truth for the existance of the actual dynamic table
export async function isExperimentTableCreated(
  experimentId: string,
  fieldsToCheck: string[],
): Promise<boolean> {
  const existingFields = (
    await PrismaClient.experiment_column.findMany({
      select: {
        field: true,
      },
      where: {
        experiment_uuid: experimentId,
      },
    })
  ).map((column) => column.field);

  if (existingFields.length === 0) {
    return false;
  }

  // A table is already created but with different fields.
  if (!arrayContainsArray(existingFields, fieldsToCheck)) {
    throw new Error('Cannot insert due to invalid fields');
  }

  return true;
}
