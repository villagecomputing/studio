'use server';

import PrismaClient from '@/lib/services/prisma';

export async function isFilenameAvailable(filename: string): Promise<boolean> {
  const trimmedFilename = filename.trim();
  if (!trimmedFilename) {
    return false;
  }

  const totalFilesWithSameFilename = await PrismaClient.dataset_list.count({
    where: {
      name: {
        equals: trimmedFilename,
      },
    },
  });

  return !totalFilesWithSameFilename;
}
