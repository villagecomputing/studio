import ApiUtils from '@/lib/services/ApiUtils';
import { createFakeId, getDatasetUuidFromFakeId } from '@/lib/utils';
import { response } from '../../utils';
import { datasetViewResponseSchema } from './schema';

export async function GET(
  request: Request,
  { params }: { params: { datasetId: string } },
) {
  try {
    const datasetId = params.datasetId;
    if (!datasetId) {
      return response('Invalid dataset id', 400);
    }

    const dataset = await ApiUtils.getDataset(
      getDatasetUuidFromFakeId(datasetId),
    );

    if (!datasetViewResponseSchema.safeParse(dataset).success) {
      return response('Invalid response dataset view type', 500);
    }

    const res = JSON.stringify({
      ...dataset,
      id: createFakeId(dataset.name, dataset.id),
    });
    return Response.json(res);
  } catch (error) {
    console.error('Error in GET dataset view:', error);
    return response('Error processing request', 500);
  }
}
