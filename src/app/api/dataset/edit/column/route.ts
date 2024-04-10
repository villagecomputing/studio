import { hasApiAccess, response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { NextRequest } from 'next/server';
import { editDatasetColumnSchema } from './schema';

/**
 * @swagger
 * /api/dataset/edit/column:
 *   post:
 *     tags:
 *      - Dataset
 *     summary: Edits an existing column in a dataset.
 *     description: Edits an existing column in a dataset.
 *     operationId: EditDatasetColumn
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditDatasetColumnPayload'
 *     responses:
 *       200:
 *         description: Column updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EditDatasetColumnResponse'
 *       500:
 *         description: 'Error processing request'
 */
export async function POST(request: NextRequest) {
  if (!hasApiAccess(request)) {
    return response('Unauthorized', 401);
  }

  try {
    const requestBody = await request.json();
    const { columnId, type, name } = editDatasetColumnSchema.parse(requestBody);

    const updatedColumnId = await ApiUtils.editDatasetColumn({
      name,
      type,
      columnId,
    });

    return Response.json({ id: updatedColumnId });
  } catch (error) {
    console.error('Error in EditDatasetColumn:', error);
    return response('Error processing request', 500);
  }
}
