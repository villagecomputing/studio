import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { withAuthMiddleware } from '@/lib/services/ApiUtils/user/withAuthMiddleware';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { UUIDPrefixEnum, getUuidFromFakeId } from '@/lib/utils';
import { addDataPayloadSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'AddDatasetData',
});

/**
 * @swagger
 * /api/dataset/{datasetId}/addData:
 *   post:
 *     tags:
 *      - Dataset
 *     summary: Inserts data into a dataset.
 *     description: Inserts data into a dataset.
 *     operationId: AddDatasetData
 *     security:
 *      - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: datasetId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the dataset.
 *     requestBody:
 *       description: Data to be added to the dataset
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddDataPayload'
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Missing required data -or- Invalid request headers type
 *       500:
 *         description: Error processing request
 */
export async function POST(
  request: Request,
  { params }: { params: { datasetId: string } },
) {
  return withAuthMiddleware(request, async () => {
    const startTime = performance.now();

    try {
      const datasetId = params.datasetId;
      if (!datasetId) {
        logger.warn('Invalid dataset id provided');
        return response('Invalid dataset id', 400);
      }

      if (!request.headers.get('Content-Type')?.includes('application/json')) {
        logger.warn('Invalid request headers type');
        return response('Invalid request headers type', 400);
      }
      const body = await request.json();
      if (!body) {
        logger.warn('Missing required data');
        return response('Missing required data', 400);
      }

      // Parse the dataset data object using the defined schema
      // This will throw if the object doesn't match the schema
      const dataset = addDataPayloadSchema.parse(body);
      const datasetUuid = getUuidFromFakeId(datasetId, UUIDPrefixEnum.DATASET);
      await ApiUtils.addData({ datasetId: datasetUuid, payload: dataset });

      logger.info('Data added to dataset successfully', {
        elapsedTimeMs: performance.now() - startTime,
        datasetId,
        rowsAdded: dataset.datasetRows.length,
      });
      return response('OK');
    } catch (error) {
      logger.error('Error adding dataset data', error);
      return response('Error processing request', 500);
    }
  });
}
