import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';
import DatabaseUtils from '@/lib/services/DatabaseUtils';
import PrismaClient from '@/lib/services/prisma';
import { createFakeId } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { response } from '../../utils';
import { experimentListResponseSchema } from './schema';
export const dynamic = 'force-dynamic';
/**
 * @swagger
 * /api/experiment/list:
 *   get:
 *     tags:
 *      - Experiment
 *     summary: List all experiments
 *     description: List all experiments
 *     operationId: ListExperiments
 *     responses:
 *       200:
 *         description: A list of experiments.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListExperimentResponse'
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
          let rowsWithAccuracyCount = 0;
          try {
            rowsWithAccuracyCount = Number(
              await DatabaseUtils.selectAggregation(
                experiment.uuid,
                { func: 'COUNT' },
                { accuracy: { isNotNull: true } },
              ),
            );
          } catch (_e) {}
          return {
            id: createFakeId(experiment.name, experiment.uuid),
            name: experiment.name,
            description: experiment.description || '',
            groupId: experiment.group_id,
            pipelineMetadata: experiment.pipeline_metadata,
            created_at: experiment.created_at.toDateString(),
            latencyP50: experiment.latency_p50,
            latencyP90: experiment.latency_p90,
            runtime: experiment.total_latency,
            avgAccuracy: rowsWithAccuracyCount
              ? experiment.total_accuracy / rowsWithAccuracyCount
              : 0,
            totalCost: experiment.total_cost,
            totalRows: experiment.total_rows,
            Dataset: {
              ...experiment.Dataset,
              id: createFakeId(
                experiment.Dataset.name,
                experiment.Dataset.uuid,
              ),
            },
          };
        }),
      );

    if (
      !experimentListResponseSchema.safeParse(experimentListResponse).success
    ) {
      return response('Invalid response datasetList type', 400);
    }

    return Response.json(experimentListResponse);
  } catch (error) {
    console.error('Error in GET experiment list:', error);
    return response('Error processing request', 500);
  }
}
