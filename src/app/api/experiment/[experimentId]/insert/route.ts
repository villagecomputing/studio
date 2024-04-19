import { hasApiAccess, response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
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
  const startTime = performance.now();
  if (!(await hasApiAccess(request))) {
    logger.warn('Unauthorized request');
    return response('Unauthorized', 401);
  }

  let experimentId = params.experimentId;
  try {
    experimentId = getUuidFromFakeId(experimentId, UUIDPrefixEnum.EXPERIMENT);
  } catch (error) {
    logger.warn(`Invalid experiment id`, { experimentId, error });
    return response('Invalid experiment id', 400);
  }
  const requestBody = await request.json();
  const payload = insertExperimentPayloadSchema.parse(requestBody);

  try {
    // Creates table if it doesn't exist
    await ApiUtils.ensureExperimentTable({ experimentId, payload });
    logger.debug('Ensure dynamic experiments table created', {
      experimentId,
    });
  } catch (error) {
    logger.error('Error creating experiment dynamic table', {
      error,
      experimentId,
    });
    return response('Error creating experiment dynamic table', 500);
  }
  try {
    await ApiUtils.insertExperimentSteps({ experimentId, payload });
    logger.debug('Inserted experiments steps', {
      experimentId,
      payload,
    });
  } catch (error) {
    logger.error('Error inserting experiment steps', { error, experimentId });
    return response('Error inserting experiment steps', 500);
  }

  try {
    await ApiUtils.updateExperiment(experimentId, payload);
    logger.debug('Updated experiment metadata', {
      experimentId,
    });
  } catch (error) {
    logger.error('Error updating experiment details', { error, experimentId });
    return response('Error updating experiment details', 500);
  }

  logger.info(`Experiment steps inserted successfully`, {
    elapsedTimeMs: performance.now() - startTime,
    experimentId,
    accuracy: payload.accuracy,
    index: payload.index,
  });

  return response('Ok');
}
