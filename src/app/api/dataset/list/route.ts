import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';
import DatabaseUtils from '@/lib/services/DatabaseUtils';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import PrismaClient from '@/lib/services/prisma';
import { createFakeId } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { hasApiAccess, response } from '../../utils';
import { datasetListResponseSchema } from './schema';
export const dynamic = 'force-dynamic';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'ListDatasets',
});
/**
 * @swagger
 * /api/dataset/list:
 *   get:
 *     tags:
 *      - Dataset
 *     summary: Retrieves a list of datasets and their total row counts
 *     description: Retrieves a list of datasets and their total row counts
 *     operationId: ListDatasets
 *     security:
 *      - ApiKeyAuth: []
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
export async function GET(request: Request) {
  const startTime = performance.now();

  if (!(await hasApiAccess(request))) {
    logger.warn('Unauthorized request');
    return response('Unauthorized', 401);
  }

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
          const totalRows = await DatabaseUtils.selectAggregation(
            dataset.uuid,
            {
              func: 'COUNT',
            },
          );

          const result = {
            ...dataset,
            id: createFakeId(dataset.name, dataset.uuid),
            created_at: dataset.created_at.toDateString(),
            total_rows: totalRows,
          };
          logger.debug(`Dataset data`, result);
          return result;
        }),
      );

    const parsedDatasetListResponse =
      datasetListResponseSchema.safeParse(datasetListResponse);
    if (!parsedDatasetListResponse.success) {
      logger.error(
        'Error parsing dataset list response type',
        parsedDatasetListResponse.error,
      );
      return response('Invalid response type', 500);
    }

    logger.info(`Datasets retrieved.`, {
      elapsedTimeMs: performance.now() - startTime,
      count: datasetListResponse.length,
    });

    return Response.json(datasetListResponse);
  } catch (error) {
    logger.error('Error getting dataset list:', error);
    return response('Error processing request', 500);
  }
}
