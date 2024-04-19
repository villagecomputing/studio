import ApiUtils from '@/lib/services/ApiUtils';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { createFakeId } from '@/lib/utils';
import { hasApiAccess, response } from '../../utils';
import { newDatasetPayloadSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'InitializeDataset',
});

/**
 * @swagger
 * /api/dataset/new:
 *   post:
 *     tags:
 *      - Dataset
 *     summary: Initializes a new dataset.
 *     description: Initializes a new dataset.
 *     operationId: InitializeDataset
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewDatasetPayload'
 *     responses:
 *       200:
 *         description: Successfully created a new dataset.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewDatasetResponse'
 *       400:
 *         description: Invalid request headers type or Missing required data.
 *       500:
 *         description: Error processing request.
 */
export async function POST(request: Request) {
  const startTime = performance.now();
  if (!(await hasApiAccess(request))) {
    logger.warn('Unauthorized request');
    return response('Unauthorized', 401);
  }

  try {
    if (!request.headers.get('Content-Type')?.includes('application/json')) {
      logger.warn('Invalid request headers type', 400);
    }
    const body = await request.json();
    if (!body) {
      logger.warn('Missing required data');
      return response('Missing required data', 400);
    }

    // Parse the dataset data object using the defined schema
    // This will throw if the object doesn't match the schema
    const dataset = newDatasetPayloadSchema.parse(body);
    const id = await ApiUtils.newDataset(dataset);

    const fakeId = createFakeId(dataset.datasetName, id);
    logger.info('Created a new dataset', {
      id: fakeId,
      dataset,
      elapsedTimeMs: performance.now() - startTime,
    });
    return Response.json({ id: fakeId });
  } catch (error) {
    logger.error('Error creating a new Dataset:', error);
    return response('Error processing request', 500);
  }
}
