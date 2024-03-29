import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';
import DatabaseUtils from '@/lib/services/DatabaseUtils';
import PrismaClient from '@/lib/services/prisma';
import { Prisma } from '@prisma/client';
import { response } from '../../utils';
import { datasetListResponseSchema } from './schema';

export async function GET() {
  try {
    const datasetSelect = {
      uuid: true,
      created_at: true,
      name: true,
    } satisfies Prisma.DatasetSelect;

    const datasetList = await PrismaClient.dataset.findMany({
      select: datasetSelect,
      where: { deleted_at: null },
    });

    const datasetListResponse: ResultSchemaType[ApiEndpoints.datasetList] =
      await Promise.all(
        datasetList.map(async (dataset) => {
          const result = await DatabaseUtils.selectAggregation(dataset.uuid, {
            func: 'COUNT',
          });

          return {
            ...dataset,
            id: dataset.uuid,
            created_at: dataset.created_at.toDateString(),
            total_rows: result,
          };
        }),
      );

    if (!datasetListResponseSchema.safeParse(datasetListResponse).success) {
      return response('Invalid response datasetList type', 400);
    }

    const res = JSON.stringify(datasetListResponse);
    return Response.json(res);
  } catch (error) {
    console.error('Error in GET dataset list:', error);
    return response('Error processing request', 500);
  }
}
