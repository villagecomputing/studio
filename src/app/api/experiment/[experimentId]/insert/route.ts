import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { insertExperimentPayloadSchema } from './schema';

export async function POST(
  request: Request,
  { params }: { params: { experimentId: string } },
) {
  const experimentId = params.experimentId;
  const requestBody = await request.json();
  const { steps } = insertExperimentPayloadSchema.parse(requestBody);
  try {
    const outputFieldsByMetadata = steps.reduce(
      (acc: Record<string, string[]>, step) => {
        if (step.name && step.metadata) {
          acc[step.name] = step.outputs.map((output) => output.name);
        }
        return acc;
      },
      {},
    );

    ApiUtils.createExperimentTable(experimentId, outputFieldsByMetadata);

    // TODO:
    // 2) Extract fields from payload:
    //   a) step[..].name = 'METADATA' type columns
    //       - 1 row with value = step[..].metadata
    //   b) step[..].outputs[..].name = 'OUTPUT' type columns
    //       - 1 row with value = step[..].outputs[..].value
    // 4) Insert row in experimentId table with values from 2)

    return response('Ok');
  } catch (error) {
    console.error('Error in inserting experiment:', error);
    return response('Error processing request', 500);
  }
}
