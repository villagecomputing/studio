import { hasApiAccess, response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { editDatasetColumnSchema } from './schema';

export async function POST(request: Request) {
  if (!(await hasApiAccess(request))) {
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
