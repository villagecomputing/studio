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
