import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { getDatasetUuidFromFakeId } from '@/lib/utils';
import { editGroundTruthCellSchema } from './schema';

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const payload = editGroundTruthCellSchema.parse(requestBody);

    const updatedCellId = await ApiUtils.editGroundTruthCell({
      ...payload,
      datasetId: getDatasetUuidFromFakeId(payload.datasetId),
    });

    return Response.json({ id: updatedCellId });
  } catch (error) {
    console.error('Error in EditDatasetCell:', error);
    return response('Error processing request', 500);
  }
}
