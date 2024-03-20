import ApiUtils from '@/lib/services/ApiUtils';
import { insertExperimentPayloadSchema } from './schema';

export async function POST(
  request: Request,
  { params }: { params: { experimentId: string } },
) {
  const experimentId = params.experimentId;
  const requestBody = await request.json();
  const payload = insertExperimentPayloadSchema.parse(requestBody);

  ApiUtils.createExperimentTable(experimentId, payload);
  // TODO:
  // 2) Extract fields from payload:
  //   a) step[..].name = 'METADATA' type columns
  //       - 1 row with value = step[..].metadata
  //   b) step[..].outputs[..].name = 'OUTPUT' type columns
  //       - 1 row with value = step[..].outputs[..].value
  // 4) Insert row in experimentId table with values from 2)

  throw new Error('Not implemented');
}
