import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { getDatasetUuidFromFakeId } from '@/lib/utils';
import { editGroundTruthCellSchema } from './schema';

/**
 * @swagger
 * /api/dataset/edit/cell:
 *   post:
 *     tags:
 *      - Dataset
 *     summary: Edits a specific cell in a dataset's ground truth.
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
 *     description: Edits a ground truth cell in a dataset.
 */
export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const payload = editGroundTruthCellSchema.parse(requestBody);

    const updatedCellId = await ApiUtils.editGroundTruthCell({
      ...payload,
      datasetId: getDatasetUuidFromFakeId(payload.datasetId),
    });

    return Response.json({ id: updatedCellId });
  } catch (error) {
    console.error('Error in EditDatasetCell:', error);
    return response('Error processing request', 500);
  }
}
