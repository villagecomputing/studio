import ApiUtils from '@/lib/services/ApiUtils';
import { response } from '../../utils';
import { experimentViewResponseSchema } from './schema';

/**
 * @swagger
 * /api/experiment/{experimentId}:
 *   get:
 *     tags:
 *      - Experiment
 *     summary: Fetches the details of an experiment with the specified Id.
 *     description: Fetches the details of an experiment with the specified Id.
 *     operationId: GetExperimentData
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
  try {
    const experimentId = params.experimentId;
    if (!experimentId) {
      return response('Invalid experiment id', 400);
    }
    const result = await ApiUtils.getExperiment(experimentId);

    if (!experimentViewResponseSchema.safeParse(result).success) {
      return response('Invalid response experiment view type', 500);
    }

    return Response.json(result);
  } catch (error) {
    console.error('Error in GET experiment view:', error);
    return response('Error processing request', 500);
  }
}
