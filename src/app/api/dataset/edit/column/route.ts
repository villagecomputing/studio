import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { editDatasetColumnSchema } from './schema';

/**
 * @swagger
 * /api/dataset/edit/column:
 *   post:
 *     tags:
 *      - dataset
 *     description: Edits dataset column (TODO - add rest body, response and rest of data - ex [https://editor.swagger.io/](https://editor.swagger.io/) )
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
