'use server';

import PrismaClient from '@/lib/services/prisma';

export async function isFilenameAvailable(filename: string): Promise<boolean> {
  const trimmedFilename = filename.trim();
  if (!trimmedFilename) {
    return false;
  }

  const totalFilesWithSameFilename = await PrismaClient.dataset.count({
    where: {
      file_name: {
        equals: trimmedFilename,
      },
    },
  });

  return !totalFilesWithSameFilename;
}
