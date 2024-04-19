import { hasApiAccess, response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { UUIDPrefixEnum, getUuidFromFakeId } from '@/lib/utils';
import { approveAllSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'ApproveAllGroundTruths',
});

/**
 * @swagger
 * /api/dataset/edit/approveAll:
 *   post:
 *     tags:
 *      - Dataset
 *     summary: Approves all ground truths for the specified dataset.
 *     description: Approves all ground truths for the specified dataset.
 *     operationId: ApproveAllDatasetGroundTruths
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApproveAllGroundTruthsPayload'
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Required data is missing.
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
    const requestBody = await request.json();
    const { datasetId } = approveAllSchema.parse(requestBody);
    if (!datasetId) {
      logger.warn('Dataset id is missing');
      return response('Required data is missing', 400);
    }
    await ApiUtils.approveAll({
      datasetId: getUuidFromFakeId(datasetId, UUIDPrefixEnum.DATASET),
    });
    logger.info('All ground truths approved', {
      elapsedTimeMs: performance.now() - startTime,
      datasetId,
    });
    return response('OK');
  } catch (error) {
    logger.error('Error approving all ground truths', error);
    return response('Error processing request', 500);
  }
}
