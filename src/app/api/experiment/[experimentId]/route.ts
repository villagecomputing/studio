import ApiUtils from '@/lib/services/ApiUtils';
import { withAuthMiddleware } from '@/lib/services/ApiUtils/user/withAuthMiddleware';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { UUIDPrefixEnum, createFakeId, getUuidFromFakeId } from '@/lib/utils';
import { response } from '../../utils';
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
 *         example: Experiment_Name-e-3964f3dd-23e0-4bfe-9f1e-b72774e4b1ea
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
  return withAuthMiddleware(request, async (userId) => {
    const startTime = performance.now();

    try {
      let experimentId = params.experimentId;
      try {
        experimentId = getUuidFromFakeId(
          experimentId,
          UUIDPrefixEnum.EXPERIMENT,
        );
      } catch (error) {
        logger.warn('Invalid experiment id', { experimentId, error });
        return response('Invalid experiment id', 400);
      }
      const result = await ApiUtils.getExperiment(experimentId, userId);
      const experiment = {
        ...result,
        id: createFakeId(result.name, result.id),
        dataset: {
          ...result.dataset,
          id: createFakeId(result.dataset.name, result.dataset.id),
        },
      };

      const parsedExperiment =
        experimentViewResponseSchema.safeParse(experiment);
      if (!parsedExperiment.success) {
        logger.error(
          'Experiment view response validation failed',
          parsedExperiment.error,
          {
            experimentId,
          },
        );
        return response('Invalid response experiment view type', 500);
      }

      const { rows, ...experimentSummary } = experiment;
      logger.info('Experiment data retrieved', {
        elapsedTimeMs: performance.now() - startTime,
        ...experimentSummary,
        rowCount: rows.length,
      });

      return Response.json(experiment);
    } catch (error) {
      logger.error('Error in getting experiment', error);
      return response('Error processing request', 500);
    }
  });
}
