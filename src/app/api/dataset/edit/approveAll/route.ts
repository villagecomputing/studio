import { hasApiAccess, response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { getDatasetUuidFromFakeId } from '@/lib/utils';
import { approveAllSchema } from './schema';

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
  if (!(await hasApiAccess(request))) {
    return response('Unauthorized', 401);
  }

  try {
    const requestBody = await request.json();
    const { datasetId } = approveAllSchema.parse(requestBody);
    if (!datasetId) {
      return response('Required data is missing', 400);
    }
    await ApiUtils.approveAll({
      datasetId: getDatasetUuidFromFakeId(datasetId),
    });
    return response('OK');
  } catch (error) {
    console.error('Error in dataset/edit/approveAll', error);
    return response('Error processing request', 500);
  }
}
