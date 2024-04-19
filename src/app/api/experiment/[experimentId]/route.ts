import ApiUtils from '@/lib/services/ApiUtils';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { UUIDPrefixEnum, createFakeId, getUuidFromFakeId } from '@/lib/utils';
import { hasApiAccess, response } from '../../utils';
import { experimentViewResponseSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'GetExperimentData',
});

/**
 * @swagger
 * /api/experiment/{experimentId}:
 *   get:
 *     tags:
 *      - Experiment
 *     summary: Fetches the details of an experiment with the specified Id.
 *     description: Fetches the details of an experiment with the specified Id.
 *     operationId: GetExperimentData
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: experimentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the experiment to retrieve.
 *     responses:
 *       200:
 *         description: Experiment data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExperimentViewResponse'
 *       400:
 *         description: Invalid experiment id
 *       500:
 *         description: Invalid response experiment view type -or- Error processing request
 */
export async function GET(
  request: Request,
  { params }: { params: { experimentId: string } },
) {
  const startTime = performance.now();
  if (!(await hasApiAccess(request))) {
    logger.warn('Unauthorized request');
    return response('Unauthorized', 401);
  }

  try {
    let experimentId = params.experimentId;
    try {
      experimentId = getUuidFromFakeId(experimentId, UUIDPrefixEnum.EXPERIMENT);
    } catch (_e) {
      logger.warn('Invalid experiment id', { experimentId });
      return response('Invalid experiment id', 400);
    }
    const result = await ApiUtils.getExperiment(experimentId);
    const experiment = {
      ...result,
      id: createFakeId(result.name, result.id),
      dataset: {
        ...result.dataset,
        id: createFakeId(result.dataset.name, result.dataset.id),
      },
    };

    const parsedExperiment = experimentViewResponseSchema.safeParse(experiment);
    if (!parsedExperiment.success) {
      logger.error('Experiment view response validation failed', {
        experimentId,
        error: parsedExperiment.error,
      });
      return response('Invalid response experiment view type', 500);
    }

    logger.info('Experiment data retrieved successfully', {
      elapsedTimeMs: performance.now() - startTime,
      experiment,
    });

    return Response.json(experiment);
  } catch (error) {
    logger.error('Error in getting experiment', error);
    return response('Error processing request', 500);
  }
}
