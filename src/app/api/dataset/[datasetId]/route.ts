import ApiUtils from '@/lib/services/ApiUtils';
import { createFakeId, getDatasetUuidFromFakeId } from '@/lib/utils';
import { NextRequest } from 'next/server';
import { hasApiAccess, response } from '../../utils';
import { datasetViewResponseSchema } from './schema';

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
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { datasetId: string } },
) {
  if (!hasApiAccess(request)) {
    return response('Unauthorized', 401);
  }

  try {
    const datasetId = params.datasetId;
    if (!datasetId) {
      return response('Invalid dataset id', 400);
    }

    const dataset = await ApiUtils.getDataset(
      getDatasetUuidFromFakeId(datasetId),
    );

    const validationResult = datasetViewResponseSchema.safeParse(dataset);
    if (!validationResult.success) {
      console.error(validationResult.error);
      return response('Invalid response dataset view type', 500);
    }

    return Response.json({
      ...dataset,
      id: createFakeId(dataset.name, dataset.id),
    });
  } catch (error) {
    console.error('Error in GET dataset view:', error);
    return response('Error processing request', 500);
  }
}
