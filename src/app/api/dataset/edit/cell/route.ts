import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { withAuthMiddleware } from '@/lib/services/ApiUtils/user/withAuthMiddleware';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { UUIDPrefixEnum, getUuidFromFakeId } from '@/lib/utils';
import { editGroundTruthCellSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'EditDatasetCell',
});

/**
 * @swagger
 * /api/dataset/edit/cell:
 *   post:
 *     tags:
 *      - Dataset
 *     summary: Edits a specific cell in a dataset's ground truth.
 *     description: Edits a specific cell in a dataset's ground truth.
 *     operationId: EditDatasetCell
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditCellPayload'
 *     responses:
 *       200:
 *         description: Ground truth cell updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EditGroundTruthCellResponse'
 *       500:
 *         description: 'Error processing result.'
 */
export async function POST(request: Request) {
  return withAuthMiddleware(request, async () => {
    const startTime = performance.now();

    try {
      const requestBody = await request.json();
      const payload = editGroundTruthCellSchema.parse(requestBody);

      const updatedCellId = await ApiUtils.editGroundTruthCell({
        ...payload,
        datasetId: getUuidFromFakeId(payload.datasetId, UUIDPrefixEnum.DATASET),
      });

      logger.info('Ground truth cell updated', {
        elapsedTimeMs: performance.now() - startTime,
        payload,
        cellId: updatedCellId,
      });
      return Response.json({ id: updatedCellId });
    } catch (error) {
      logger.error('Error editing Dataset cell', error);
      return response('Error processing request', 500);
    }
  });
}
