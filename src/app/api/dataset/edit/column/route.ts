import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { editDatasetColumnSchema } from './schema';

export async function POST(request: Request) {
  try {
    const { columnId, type, name } = editDatasetColumnSchema.parse(
      request.body,
    );

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
