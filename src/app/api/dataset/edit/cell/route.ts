import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { editDatasetCellSchema } from './schema';

export async function POST(request: Request) {
  try {
    const payload = editDatasetCellSchema.parse(request.body);

    if (!payload.groundTruthCellId) {
      throw new Error('Ground Truth Cell Id is required');
    }

    if (!payload.content) {
      return response('Cell cannot be empty', 400);
    }

    const updatedCellId = await ApiUtils.editDatasetCell(payload);

    return Response.json({ id: updatedCellId });
  } catch (error) {
    console.error('Error in EditDatasetCell:', error);
    return response('Error processing request', 500);
  }
}
