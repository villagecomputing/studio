import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';
import DatabaseUtils from '@/lib/services/DatabaseUtils';
import PrismaClient from '@/lib/services/prisma';
import { createFakeId } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { hasApiAccess, response } from '../../utils';
export const dynamic = 'force-dynamic';
/**
 * @swagger
 * /api/logs/list:
 *   get:
 *     tags:
 *      - Logs
 *     summary: Logs list
 *     description: Logs list
 *     operationId: ListLogs
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Logs list.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListLogsResponse'
 *       500:
 *         description: 'Error processing request.'
 */
export async function GET(request: Request) {
  if (!(await hasApiAccess(request))) {
    return response('Unauthorized', 401);
  }

  try {
    const logsSelect = {
      uuid: true,
      name: true,
      description: true,
      created_at: true,
      pipeline_metadata: true,
      latency_p50: true,
      latency_p90: true,
      total_accuracy: true,
      total_cost: true,
      total_latency: true,
      total_rows: true,
    } satisfies Prisma.LogsSelect;

    const logsList = await PrismaClient.logs.findMany({
      select: logsSelect,
      where: { deleted_at: null },
    });

    const logsListResponse: ResultSchemaType[ApiEndpoints.logsList] =
      await Promise.all(
        logsList.map(async (logsEntry) => {
          let rowsWithAccuracyCount = 0;
          try {
            rowsWithAccuracyCount = Number(
              await DatabaseUtils.selectAggregation(
                logsEntry.uuid,
                { func: 'COUNT' },
                { accuracy: { isNotNull: true } },
              ),
            );
          } catch (_e) {}
          return {
            id: createFakeId(logsEntry.name, logsEntry.uuid),
            name: logsEntry.name,
            description: logsEntry.description || '',
            pipelineMetadata: logsEntry.pipeline_metadata,
            createdAt: logsEntry.created_at.toDateString(),
            latencyP50: logsEntry.latency_p50,
            latencyP90: logsEntry.latency_p90,
            runtime: logsEntry.total_latency,
            avgAccuracy: rowsWithAccuracyCount
              ? logsEntry.total_accuracy / rowsWithAccuracyCount
              : 0,
            totalCost: logsEntry.total_cost,
            totalRows: logsEntry.total_rows,
          };
        }),
      );
    return Response.json(logsListResponse);
  } catch (error) {
    console.error('Error in GET logs list:', error);
    return response('Error processing request', 500);
  }
}
