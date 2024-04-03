import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';
import DatabaseUtils from '@/lib/services/DatabaseUtils';
import PrismaClient from '@/lib/services/prisma';
import { createFakeId } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { response } from '../../utils';
import { datasetListResponseSchema } from './schema';

/**
 * @swagger
 * /api/dataset/list:
 *   get:
 *     tags:
 *      - Dataset
 *     summary: Retrieves a list of datasets and their total row counts
 *     description: Retrieves a list of datasets and their total row counts
 *     operationId: ListDatasets
 *     responses:
 *       200:
 *          description: Dataset retrieved
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DatasetListResponse'
 *       400:
 *         description: Invalid response datasetList type
 *       500:
 *         description: Error processing request
 */
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
            id: createFakeId(dataset.name, dataset.uuid),
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
