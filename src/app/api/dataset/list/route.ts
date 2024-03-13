import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';
import PrismaClient from '@/lib/services/prisma';
import { Prisma } from '@prisma/client';
import { response } from '../../utils';
import { datasetListResponseSchema } from './schema';

export async function GET() {
  try {
    const datasetSelect = {
      id: true,
      created_at: true,
      name: true,
    } satisfies Prisma.Dataset_listSelect;

    const datasetList = await PrismaClient.dataset_list.findMany({
      select: datasetSelect,
      where: { deleted_at: null },
    });

    const datasetListResponse: ResultSchemaType[ApiEndpoints.datasetList] =
      datasetList.map((dataset) => {
        return {
          ...dataset,
          created_at: dataset.created_at.toDateString(),
          // TODO: total_rows = number of rows from ${dataset.name} table.
          total_rows: 0,
        };
      });

    if (!datasetListResponseSchema.safeParse(datasetListResponse)) {
      return response('Invalid response datasetList type', 400);
    }

    const res = JSON.stringify(datasetListResponse);
    return Response.json(res);
  } catch (error) {
    console.error('Error in GET dataset list:', error);
    return response('Error processing request', 500);
  }
}
