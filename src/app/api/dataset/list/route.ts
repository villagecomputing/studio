import PrismaClient from '@/lib/services/prisma';
import { Prisma } from '@prisma/client';
import { response } from '../../utils';
import { datasetListResponseSchema } from './schema';

export async function GET() {
  try {
    const datasetSelect = {
      id: true,
      created_at: true,
      file_location: true,
      file_name: true,
      total_rows: true,
    } satisfies Prisma.DatasetSelect;

    const datasetList = await PrismaClient.dataset.findMany({
      select: datasetSelect,
      where: { deleted_at: null },
    });
    if (!datasetListResponseSchema.safeParse(datasetList)) {
      return response('Invalid response datasetList type', 400);
    }

    const res = JSON.stringify(datasetList);
    return Response.json(res);
  } catch (error) {
    console.error('Error in GET dataset list:', error);
    return response('Error processing request', 500);
  }
}
