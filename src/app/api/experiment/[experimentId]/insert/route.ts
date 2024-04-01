import { response } from '@/app/api/utils';
import ApiUtils from '@/lib/services/ApiUtils';
import { insertExperimentPayloadSchema } from './schema';

/**
 * @swagger
 * /api/experiment/{experimentId}/insert:
 *   post:
 *     tags:
 *      - Experiment
 *     summary: Inserts steps into an experiment with the given Id.
 *     description: Ensures the experiment is created and inserts the given steps as a row for the given experiment
 *     operationId: InsertExperimentRow
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
  const experimentId = params.experimentId;
  const requestBody = await request.json();
  const payload = insertExperimentPayloadSchema.parse(requestBody);

  try {
    // Creates table if it doesn't exist
    await ApiUtils.ensureExperimentTable(experimentId, payload);
  } catch (error) {
    console.error('Error creating experiment dynamic table:', error);
    return response('Error processing request', 500);
  }
  try {
    await ApiUtils.insertExperimentSteps(experimentId, payload);
  } catch (error) {
    console.error('Error inserting experiment steps:', error);
    return response('Error processing request', 500);
  }

  try {
    await ApiUtils.updateExperiment(experimentId, payload);
  } catch (error) {
    console.error('Error updating experiment details:', error);
    return response('Error processing request', 500);
  }

  return response('Ok');
}
