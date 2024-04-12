import { hasApiAccess, response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { getDatasetUuidFromFakeId } from '@/lib/utils';
import { addDataPayloadSchema } from './schema';

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
  if (!(await hasApiAccess(request))) {
    return response('Unauthorized', 401);
  }
  try {
    const datasetId = params.datasetId;
    if (!datasetId) {
      return response('Invalid dataset id', 400);
    }

    if (!request.headers.get('Content-Type')?.includes('application/json')) {
      return response('Invalid request headers type', 400);
    }
    const body = await request.json();
    if (!body) {
      return response('Missing required data', 400);
    }

    // Parse the dataset data object using the defined schema
    // This will throw if the object doesn't match the schema
    const dataset = addDataPayloadSchema.parse(body);
    const datasetUuid = getDatasetUuidFromFakeId(datasetId);
    await ApiUtils.addData({ datasetId: datasetUuid, payload: dataset });

    return response('OK');
  } catch (error) {
    console.error('Error in POST:', error);
    return response('Error processing request', 500);
  }
}
