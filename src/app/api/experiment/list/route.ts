import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';
import PrismaClient from '@/lib/services/prisma';
import { Prisma } from '@prisma/client';
import { response } from '../../utils';
import { experimentListResponseSchema } from './schema';

/**
 * @swagger
 * /api/experiment/list:
 *   get:
 *     tags:
 *      - Experiment
 *     summary: List all experiments
 *     responses:
 *       200:
 *         description: A list of experiments.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Experiment/ListExperimentResponse'
 *       400:
 *         description: 'Invalid response datasetList type.'
 *       500:
 *         description: 'Error processing request.'
 */
export async function GET() {
  try {
    const experimentSelect = {
      uuid: true,
      name: true,
      description: true,
      created_at: true,
      group_id: true,
      pipeline_metadata: true,
      latency_p50: true,
      latency_p90: true,
      total_accuracy: true,
      total_cost: true,
      total_latency: true,
      total_rows: true,
      Dataset: {
        select: {
          uuid: true,
          name: true,
        },
      },
    } satisfies Prisma.ExperimentSelect;

    const experimentList = await PrismaClient.experiment.findMany({
      select: experimentSelect,
      where: { deleted_at: null },
    });

    const experimentListResponse: ResultSchemaType[ApiEndpoints.experimentList] =
      await Promise.all(
        experimentList.map(async (experiment) => {
          return {
            ...experiment,
            id: experiment.uuid,
            description: experiment.description || '',
            groupId: experiment.group_id,
            pipelineMetadata: experiment.pipeline_metadata,
            created_at: experiment.created_at.toDateString(),
            latencyP50: experiment.latency_p50,
            latencyP90: experiment.latency_p90,
            runtime: experiment.total_latency,
            totalAccuracy: experiment.total_accuracy,
            totalCost: experiment.total_cost,
            totalLatency: experiment.total_latency,
            totalRows: experiment.total_rows,
            Dataset: {
              ...experiment.Dataset,
              id: experiment.Dataset.uuid,
            },
          };
        }),
      );

    if (!experimentListResponseSchema.safeParse(experimentListResponse)) {
      return response('Invalid response datasetList type', 400);
    }

    const res = JSON.stringify(experimentListResponse);
    return Response.json(res);
  } catch (error) {
    console.error('Error in GET experiment list:', error);
    return response('Error processing request', 500);
  }
}
