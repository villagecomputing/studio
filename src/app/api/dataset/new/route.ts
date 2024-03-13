import ApiUtils from '@/lib/services/ApiUtils';
import { response } from '../../utils';
import { newDatasetPayloadSchema } from './schema';

export async function POST(request: Request) {
  try {
    if (!request.headers.get('Content-Type')?.includes('application/json')) {
      return response('Invalid request headers type', 400);
    }
    const body = await request.json();
    if (!body) {
      return response('Missing required data', 400);
    }

    // Parse the dataset data object using the defined schema
    // This will throw if the object doesn't match the schema
    const dataset = newDatasetPayloadSchema.parse(body);
    ApiUtils.newDataset(dataset);

    return response('OK');
  } catch (error) {
    console.error('Error in POST:', error);
    return response('Error processing request', 500);
  }
}
