import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { getDatasetUuidFromFakeId } from '@/lib/utils';
import { approveAllSchema } from './schema';

/**
 * @swagger
 * /api/dataset/edit/approveAll:
 *   post:
 *     tags:
 *      - Dataset
 *     requestBody:
 *       $ref: '#/components/schemas/Dataset/ApproveAllGroundTruthsPayload'
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Required data is missing.
 *       500:
 *         description: Error processing request.
 *     description: Approves all ground truths for a given dataset.
 */
export async function POST(request: Request) {
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
