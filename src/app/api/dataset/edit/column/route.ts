import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
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
export async function POST(request: Request) {
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
