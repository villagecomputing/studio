import { assertDatasetExists } from '@/lib/services/DatabaseUtils/common';
import PrismaClient from '@/lib/services/prisma';
import { UUIDPrefixEnum, generateUUID } from '@/lib/utils';
import { response } from '../../utils';
import { newExperimentPayloadSchema } from './schema';

export async function POST(request: Request) {
  const requestBody = await request.json();
  const payload = newExperimentPayloadSchema.parse(requestBody);
  try {
    await assertDatasetExists(payload.datasetId);
  } catch (error) {
    return response('Invalid dataset id', 400);
  }
  try {
    const id = generateUUID(UUIDPrefixEnum.EXPERIMENT);
    const existingExperimentGroup = await PrismaClient.experiment.findFirst({
      where: { dataset_id: payload.datasetId, deleted_at: null },
      select: { group_id: true },
    });
    const groupId = existingExperimentGroup?.group_id
      ? existingExperimentGroup.group_id
      : (
          await PrismaClient.experiment_group.create({
            data: {},
            select: { id: true },
          })
        ).id;
    await PrismaClient.experiment.create({
      data: {
        uuid: id,
        name: payload.name,
        dataset_id: payload.datasetId,
        pipeline_metadata: JSON.stringify(payload.parameters),
        group_id: groupId,
      },
    });
    return Response.json({ id });
  } catch (error) {
    console.error('Error in newExperiment:', error);
    return response('Error processing request', 500);
  }
}
