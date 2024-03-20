import { insertExperimentPayloadSchema } from './schema';

export async function POST(
  request: Request,
  { params }: { params: { experimentId: string } },
) {
  const requestBody = await request.json();
  const _payload = insertExperimentPayloadSchema.parse(requestBody);
  const _experimentId = params.experimentId;

  // TODO:
  // 1) Check experimentId exists in Experiment table - if not return 400
  // 2) Extract fields from payload:
  //   a) step[..].name = 'METADATA' type columns
  //       - 1 row with value = step[..].metadata
  //   b) step[..].outputs[..].name = 'OUTPUT' type columns
  //       - 1 row with value = step[..].outputs[..].value
  // 3) Check table with name = experimentId exists
  //     - if not
  //       a) create table with name = experimentId and column definitions from 2)
  //       b) insert in Experiment_Column
  //     - if exists get and compare columns
  //       - if columns do not match return 400
  // 4) Insert row in experimentId table with values from 2)

  throw new Error('Not implemented');
}
