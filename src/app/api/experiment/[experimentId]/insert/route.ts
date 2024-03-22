import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { insertExperimentPayloadSchema } from './schema';

export async function POST(
  request: Request,
  { params }: { params: { experimentId: string } },
) {
  const experimentId = params.experimentId;
  const requestBody = await request.json();
  try {
    const payload = insertExperimentPayloadSchema.parse(requestBody);
    // Creates table if it doesn't exist
    await ApiUtils.createExperimentTable(experimentId, payload);
    await ApiUtils.insertExperimentSteps(experimentId, payload);

    return response('Ok');
  } catch (error) {
    console.error('Error in inserting experiment:', error);
    return response('Error processing request', 500);
  }
}
