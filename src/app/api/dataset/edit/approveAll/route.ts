import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { approveAllSchema } from './schema';

export async function POST(request: Request) {
  try {
    const { datasetId } = approveAllSchema.parse(request.body);
    if (!datasetId) {
      return response('Required data is missing', 400);
    }
    await ApiUtils.approveAll({ datasetId });
    return response('OK');
  } catch (error) {
    console.error('Error in dataset/edit/approveAll', error);
    return response('Error processing request', 500);
  }
}
