import ApiUtils from '@/lib/services/ApiUtils';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { UUIDPrefixEnum, createFakeId, getUuidFromFakeId } from '@/lib/utils';
import { hasApiAccess, response } from '../../utils';
import { datasetViewResponseSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'GetDatasetData',
});

/**
 * @swagger
 * /api/dataset/{datasetId}:
 *   get:
 *     tags:
 *      - Dataset
 *     summary: Retrieve the details of a specific dataset by its Id.
 *     description: Retrieve the details of a specific dataset by its Id.
 *     operationId: GetDatasetData
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: datasetId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the dataset.
 *     responses:
 *       200:
 *         description: Successfully retrieved the dataset details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DatasetViewResponse'
 *       400:
 *         description: Invalid dataset Id provided.
 *       500:
 *         description: Internal server error occurred while processing the request.
 *
 */
export async function GET(
  request: Request,
  { params }: { params: { datasetId: string } },
) {
  const startTime = performance.now();
  if (!(await hasApiAccess(request))) {
    logger.warn('Unauthorized request');
    return response('Unauthorized', 401);
  }

  try {
    const datasetId = params.datasetId;
    if (!datasetId) {
      logger.warn('Invalid dataset id provided');
      return response('Invalid dataset id', 400);
    }

    const dataset = await ApiUtils.getDataset(
      getUuidFromFakeId(datasetId, UUIDPrefixEnum.DATASET),
    );

    const validationResult = datasetViewResponseSchema.safeParse(dataset);
    if (!validationResult.success) {
      logger.error(
        'Error parsing response dataset view type',
        validationResult.error,
      );
      return response('Error processing request', 500);
    }

    logger.info(`Dataset details retrieved`, {
      elapsedTimeMs: performance.now() - startTime,
      dataset: {
        id: dataset.id,
        created_at: dataset.created_at,
        name: dataset.name,
        columns: dataset.columns,
        numberOfRows: dataset.rows.length,
      },
    });

    return Response.json({
      ...dataset,
      id: createFakeId(dataset.name, dataset.id),
    });
  } catch (error) {
    logger.error('Error getting dataset view:', error);
    return response('Error processing request', 500);
  }
}
