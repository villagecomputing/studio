import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { editGroundTruthCellSchema } from './schema';

export async function POST(request: Request) {
  try {
    const payload = editGroundTruthCellSchema.parse(request.body);

    const updatedCellId = await ApiUtils.editGroundTruthCell(payload);

    return Response.json({ id: updatedCellId });
  } catch (error) {
    console.error('Error in EditDatasetCell:', error);
    return response('Error processing request', 500);
  }
}
