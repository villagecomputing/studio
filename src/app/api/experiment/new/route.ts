import { withAuthMiddleware } from '@/lib/services/ApiUtils/user/withAuthMiddleware';
import { getDatasetOrThrow } from '@/lib/services/DatabaseUtils/common';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import PrismaClient from '@/lib/services/prisma';
import {
  UUIDPrefixEnum,
  createFakeId,
  generateUUID,
  getUuidFromFakeId,
} from '@/lib/utils';
import { ZodError } from 'zod';
import { response } from '../../utils';
import { newExperimentPayloadSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'DeclareExperiment',
});

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
export async function POST(request: Request) {
  return withAuthMiddleware(request, async (userId) => {
    const startTime = performance.now();

    const requestBody = await request.json();

    let payload;
    try {
      payload = newExperimentPayloadSchema.parse(requestBody);
    } catch (error) {
      logger.warn('Validation failed', error);
      if (error instanceof ZodError) {
        return response(
          `Validation failed: ${error.issues.map((issue) => issue.message).join(', ')}`,
          400,
        );
      } else {
        logger.error('Unexpected error during validation', error);
        return response('An unexpected error occurred', 500);
      }
    }
    const datasetId = getUuidFromFakeId(
      payload.datasetId,
      UUIDPrefixEnum.DATASET,
    );

    try {
      await getDatasetOrThrow(datasetId);
    } catch (error) {
      logger.warn('Invalid dataset id', error);
      return response('Invalid dataset id', 400);
    }
    try {
      const id = generateUUID(UUIDPrefixEnum.EXPERIMENT);
      const existingExperimentGroup =
        await PrismaClient.experiment_group.findFirst({
          where: { id: payload.groupId },
          select: { id: true },
        });
      const groupId = existingExperimentGroup?.id
        ? existingExperimentGroup.id
        : (
            await PrismaClient.experiment_group.create({
              data: { id: payload.groupId },
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
          created_by: userId,
        },
      });
      logger.info('New experiment created', {
        elapsedTimeMs: performance.now() - startTime,
        experimentId: id,
        payload,
      });
      return Response.json({ id: createFakeId(payload.name, id) });
    } catch (error) {
      logger.error('Error declaring new experiment', error);
      return response('Error processing request', 500);
    }
  });
}
