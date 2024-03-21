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

// export async function assertExperimentFields(
//   experimentId: string,
//   experimentFields: ExperimentField[],
// ) {
//   const existingColumns = (await PrismaClient.experiment_column.findMany({
//     select: {
//       field: true,
//     },
//     where: {
//       experiment_uuid: experimentId,
//     },
//   })).map(column => column.field);

//   const
//   if (existingFields)
// }
