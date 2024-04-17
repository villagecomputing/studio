import ApiUtils from '@/lib/services/ApiUtils';
import { createFakeId } from '@/lib/utils';
import { hasApiAccess, response } from '../../utils';
import { newDatasetPayloadSchema } from './schema';

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
  if (!(await hasApiAccess(request))) {
    return response('Unauthorized', 401);
  }

  try {
    if (!request.headers.get('Content-Type')?.includes('application/json')) {
      return response('Invalid request headers type', 400);
    }
    const body = await request.json();
    if (!body) {
      return response('Missing required data', 400);
    }

    // Parse the dataset data object using the defined schema
    // This will throw if the object doesn't match the schema
    const dataset = newDatasetPayloadSchema.parse(body);
    const id = await ApiUtils.newDataset(dataset);

    return Response.json({ id: createFakeId(dataset.datasetName, id) });
  } catch (error) {
    console.error('Error in POST:', error);
    return response('Error processing request', 500);
  }
}
