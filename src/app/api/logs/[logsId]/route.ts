import ApiUtils from '@/lib/services/ApiUtils';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { UUIDPrefixEnum, createFakeId, getUuidFromFakeId } from '@/lib/utils';
import { hasApiAccess, response } from '../../utils';
import { logsViewResponseSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'GetLogsData',
});
/**
 * @swagger
 * /api/logs/{logsId}:
 *   get:
 *     tags:
 *      - Logs
 *     summary: Fetches the details of the logs view with the specified Id.
 *     description: Fetches the details of the logs view with the specified Id.
 *     operationId: GetLogsData
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: logsId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the logs view to retrieve.
 *     responses:
 *       200:
 *         description: Logs data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogsViewResponse'
 *       400:
 *         description: Invalid logs id
 *       500:
 *         description: Error processing request
 */
export async function GET(
  request: Request,
  { params }: { params: { logsId: string } },
) {
  const startTime = performance.now();
  if (!(await hasApiAccess(request))) {
    logger.warn('Unauthorized request');
    return response('Unauthorized', 401);
  }

  try {
    let logsId = params.logsId;
    try {
      logsId = getUuidFromFakeId(logsId, UUIDPrefixEnum.LOGS);
    } catch (error) {
      logger.warn('Invalid logs id', { logsId, error });
      return response('Invalid logs id', 400);
    }

    const result = await ApiUtils.getLogsById(logsId);
    const logs = {
      ...result,
      id: createFakeId(result.name, result.id),
    };

    logsViewResponseSchema.parse(logs);
    const { rows, ...logsSummary } = logs;

    logger.info('Logs data retrieved', {
      elapsedTimeMs: performance.now() - startTime,
      ...logsSummary,
      rowCount: rows.length,
    });

    return Response.json(logs);
  } catch (error) {
    logger.error('Error getting logs data', error);
    return response('Error processing request', 500);
  }
}
