import ApiUtils from '@/lib/services/ApiUtils';
import { getDatasetUuidFromFakeId } from '@/lib/utils';
import { response } from '../../utils';
import { datasetViewResponseSchema } from './schema';

/**
 * @swagger
 * /api/dataset/{datasetId}:
 *   get:
 *     tags:
 *      - Dataset
 *     summary: Retrieve the details of a specific dataset by its Id.
 *     parameters:
 *       - in: path
 *         name: datasetId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the dataset.
 *     responses:
 *       '200':
 *         description: Successfully retrieved the dataset details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dataset/DatasetViewResponse'
 *       '400':
 *         description: Invalid dataset Id provided.
 *       '500':
 *         description: Internal server error occurred while processing the request.
 */
export async function GET(
  request: Request,
  { params }: { params: { datasetId: string } },
) {
  try {
    const datasetId = params.datasetId;
    if (!datasetId) {
      return response('Invalid dataset id', 400);
    }

    const result = await ApiUtils.getDataset(
      getDatasetUuidFromFakeId(datasetId),
    );

    if (!datasetViewResponseSchema.safeParse(result)) {
      return response('Invalid response dataset view type', 500);
    }

    const res = JSON.stringify(result);
    return Response.json(res);
  } catch (error) {
    console.error('Error in GET dataset view:', error);
    return response('Error processing request', 500);
  }
}
