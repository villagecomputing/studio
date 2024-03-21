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
