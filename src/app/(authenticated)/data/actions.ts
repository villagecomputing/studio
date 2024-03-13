'use server';

import PrismaClient from '@/lib/services/prisma';

export async function isDatasetNameAvailable(name: string): Promise<boolean> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return false;
  }

  const totalDatasetsWithSameName = await PrismaClient.dataset_list.count({
    where: {
      name: {
        equals: trimmedName,
      },
    },
  });

  return !totalDatasetsWithSameName;
}
