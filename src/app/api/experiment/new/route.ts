import { getDatasetOrThrow } from '@/lib/services/DatabaseUtils/common';
import PrismaClient from '@/lib/services/prisma';
import {
  UUIDPrefixEnum,
  createFakeId,
  generateUUID,
  getDatasetUuidFromFakeId,
} from '@/lib/utils';
import { NextRequest } from 'next/server';
import { hasApiAccess, response } from '../../utils';
import { newExperimentPayloadSchema } from './schema';

/**
 * @swagger
 * /api/experiment/new:
 *   post:
 *     tags:
 *      - Experiment
 *     summary: Declare a new experiment for a given dataset Id
 *     description: Declare a new experiment for a given dataset Id
 *     operationId: DeclareExperiment
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewExperimentPayload'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewExperimentResponse'
 *       400:
 *         description: 'Invalid dataset id'
 *       500:
 *         description: 'Error processing request'
 */
export async function POST(request: NextRequest) {
  if (!hasApiAccess(request)) {
    return response('Unauthorized', 401);
  }

  const requestBody = await request.json();
  const payload = newExperimentPayloadSchema.parse(requestBody);
  const datasetId = getDatasetUuidFromFakeId(payload.datasetId);

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
    return Response.json({ id: createFakeId(payload.name, id) });
  } catch (error) {
    console.error('Error in newExperiment:', error);
    return response('Error processing request', 500);
  }
}
