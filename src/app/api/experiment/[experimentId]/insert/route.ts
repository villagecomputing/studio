import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { insertExperimentPayloadSchema } from './schema';

export async function POST(
  request: Request,
  { params }: { params: { experimentId: string } },
) {
  const experimentId = params.experimentId;
  const requestBody = await request.json();
  const payload = insertExperimentPayloadSchema.parse(requestBody);
  try {
    // Creates table if it doesn't exist
    await ApiUtils.createExperimentTable(experimentId, payload);
  } catch (error) {
    console.error('Error creating experiment dynamic table:', error);
    return response('Error processing request', 500);
  }
  try {
    await ApiUtils.insertExperimentSteps(experimentId, payload);
  } catch (error) {
    console.error('Error inserting experiment steps:', error);
    return response('Error processing request', 500);
  }

  try {
    await ApiUtils.updateExperiment(experimentId, payload);
  } catch (error) {
    console.error('Error updating experiment details:', error);
    return response('Error processing request', 500);
  }

  return response('Ok');
}
