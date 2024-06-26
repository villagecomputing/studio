import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { withAuthMiddleware } from '@/lib/services/ApiUtils/user/withAuthMiddleware';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { UUIDPrefixEnum, getUuidFromFakeId } from '@/lib/utils';
import { insertExperimentPayloadSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'InsertExperimentRow',
});

/**
 * @swagger
 * /api/experiment/{experimentId}/insert:
 *   post:
 *     tags:
 *      - Experiment
 *     summary: Inserts steps into an experiment with the given Id.
 *     description: Ensures the experiment is created and inserts the given steps as a row for the given experiment
 *     operationId: InsertExperimentRow
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: experimentId
 *         required: true
 *         example: Experiment_Name-e-3964f3dd-23e0-4bfe-9f1e-b72774e4b1ea
 *         description: The unique identifier of the experiment to insert to.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExperimentInsertPayload'
 *     responses:
 *       200:
 *         description: 'Ok'
 *       500:
 *         description: 'Error processing request'
 */
export async function POST(
  request: Request,
  { params }: { params: { experimentId: string } },
) {
  return withAuthMiddleware(request, async (userId) => {
    const startTime = performance.now();

    let experimentId = params.experimentId;
    try {
      experimentId = getUuidFromFakeId(experimentId, UUIDPrefixEnum.EXPERIMENT);
    } catch (error) {
      logger.warn(`Invalid experiment id`, { error });
      return response('Invalid experiment id', 400);
    }

    let requestBody: string | undefined;
    try {
      requestBody = await request.json();
    } catch (error) {
      logger.warn(`Invalid request body`, { experimentId, error });
      return response('Invalid request body id', 400);
    }

    const payload = insertExperimentPayloadSchema.safeParse(requestBody);
    if (!payload.success) {
      logger.error('Error parsing insert experiment payload', payload.error, {
        experimentId,
        requestBody,
      });
      return response('Invalid experiment paylod', 500);
    }

    try {
      // Creates table if it doesn't exist
      await ApiUtils.ensureExperimentTable({
        experimentId,
        payload: payload.data,
      });
      logger.debug('Ensure dynamic experiments table created', {
        experimentId,
      });
    } catch (error) {
      logger.error('Error creating experiment dynamic table', error, {
        experimentId,
        requestBody,
        userId,
      });
      return response('Error processing request', 500);
    }

    try {
      await ApiUtils.insertExperimentSteps({
        experimentId,
        payload: payload.data,
      });
      logger.debug('Inserted experiments steps', {
        experimentId,
        payload,
      });
    } catch (error) {
      logger.error('Error inserting experiment steps', error, {
        requestBody,
        experimentId,
        userId,
      });
      return response('Error processing request', 500);
    }

    try {
      const updatedExperiment = await ApiUtils.updateExperiment({
        userId,
        experimentId,
        payload: payload.data,
      });
      logger.debug('Updated experiment metadata', {
        experimentId,
        updatedExperiment,
      });
    } catch (error) {
      logger.error('Error updating experiment details', error, {
        experimentId,
        requestBody,
      });
      return response('Error processing request', 500);
    }

    logger.info(`Experiment steps inserted successfully`, {
      elapsedTimeMs: performance.now() - startTime,
      experimentId,
      stepNumber: payload.data.steps.length,
      accuracy: payload.data.accuracy,
      dataset_row_id: payload.data.dataset_row_id,
    });

    return response('Ok');
  });
}
