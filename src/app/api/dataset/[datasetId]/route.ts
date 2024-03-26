import ApiUtils from '@/lib/services/ApiUtils';
import { getDatasetUuidFromFakeId } from '@/lib/utils';
import { response } from '../../utils';
import { datasetViewResponseSchema } from './schema';

/**
 * @swagger
 * /api/dataset/[datasetId]:
 *   get:
 *     tags:
 *      - dataset
 *     description: Returns a dataset (TODO - add rest body, response and rest of data - ex [https://editor.swagger.io/](https://editor.swagger.io/) )
 */
export async function GET(
  request: Request,
  { params }: { params: { datasetId: string } },
) {
  try {
    const datasetId = params.datasetId;
    if (!datasetId) {
      return response('Invalid dataset id', 400);
    }

    const result = await ApiUtils.getDataset(
      getDatasetUuidFromFakeId(datasetId),
    );

    if (!datasetViewResponseSchema.safeParse(result)) {
      return response('Invalid response dataset view type', 500);
    }

    const res = JSON.stringify(result);
    return Response.json(res);
  } catch (error) {
    console.error('Error in GET dataset view:', error);
    return response('Error processing request', 500);
  }
}
