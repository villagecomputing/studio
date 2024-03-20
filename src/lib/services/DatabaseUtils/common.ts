import PrismaClient from '../prisma';

export async function assertTableExists(tableName: string) {
  await PrismaClient.dataset_list.findUniqueOrThrow({
    where: {
      name: tableName,
    },
  });
}

export async function assertDatasetExists(datasetId: number) {
  await PrismaClient.dataset_list.findUniqueOrThrow({
    where: {
      id: datasetId,
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
