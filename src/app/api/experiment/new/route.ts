import { getDatasetOrThrow } from '@/lib/services/DatabaseUtils/common';
import PrismaClient from '@/lib/services/prisma';
import {
  UUIDPrefixEnum,
  generateUUID,
  getDatasetUuidFromFakeId,
} from '@/lib/utils';
import { response } from '../../utils';
import { newExperimentPayloadSchema } from './schema';

/**
 * @swagger
 * /api/experiment/new:
 *   post:
 *     tags:
 *      - experiment
 *     description: Adds a new experiment (TODO - add rest body, response and rest of data - ex [https://editor.swagger.io/](https://editor.swagger.io/) )
 */
export async function POST(request: Request) {
  const requestBody = await request.json();
  const payload = newExperimentPayloadSchema.parse(requestBody);
  const datasetId = getDatasetUuidFromFakeId(payload.datasetFakeId);

  try {
    await getDatasetOrThrow(datasetId);
  } catch (error) {
    return response('Invalid dataset id', 400);
  }
  try {
    const id = generateUUID(UUIDPrefixEnum.EXPERIMENT);
    const existingExperimentGroup = await PrismaClient.experiment.findFirst({
      where: { dataset_uuid: datasetId, deleted_at: null },
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
        description: payload.description,
        dataset_uuid: datasetId,
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
