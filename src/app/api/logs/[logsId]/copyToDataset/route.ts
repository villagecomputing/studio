import ApiUtils from '@/lib/services/ApiUtils';
import { getLogsDetails } from '@/lib/services/ApiUtils/logs/getLogsDetails';
import DatabaseUtils from '@/lib/services/DatabaseUtils';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { UUIDPrefixEnum, getUuidFromFakeId } from '@/lib/utils';
import { hasApiAccess, response } from '../../../utils';
import { logsToDatasetPayloadSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'CopyLogsToDataset',
});
/**
 * @swagger
 * /api/logs/{logsId}/copyToDataset:
 *   post:
 *     tags:
 *      - Logs
 *     summary: Copies logs to a dataset.
 *     description: Copies the specified rows from a dynamic logs table to a dataset table. If the dataset table does not exist it creates it.
 *     operationId: CopyLogsToDataset
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
 *         description: Logs data copied successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogsToDatasetViewResponse'
 *       400:
 *         description: Invalid logs id
 *       500:
 *         description: Error processing request
 */
export async function POST(
  request: Request,
  { params }: { params: { logsId: string } },
) {
  const startTime = performance.now();
  if (!(await hasApiAccess(request))) {
    logger.warn('Unauthorized request');
    return response('Unauthorized', 401);
  }

  // Ensure logs id param is valid
  let logsId = params.logsId;
  try {
    logsId = getUuidFromFakeId(logsId, UUIDPrefixEnum.LOGS);
  } catch (error) {
    logger.warn('Invalid logs id', { logsId, error });
    return response('Invalid logs id', 400);
  }

  try {
    const requestBody = await request.json();
    const payload = logsToDatasetPayloadSchema.parse(requestBody);

    const logDetails = await getLogsDetails(logsId);

    // Ensure related dataset created
    let datasetId = logDetails.dataset_uuid;
    if (!datasetId) {
      datasetId = await ApiUtils.newDataset({
        datasetName: `${logDetails.name}_Dataset`,
        columns: Object.keys(payload.rows[0].inputs),
        groundTruths: Object.keys(payload.rows[0].outputs),
      });
    }

    // Adding rows to dynamic dataset
    await ApiUtils.addData({
      datasetId,
      payload: {
        datasetRows: payload.rows.map((row) => {
          return {
            logs_row_index: row.logs_row_index,
            ...row.inputs,
            ...row.outputs,
          };
        }),
      },
    });

    const result = await DatabaseUtils.select<Record<string, string>>({
      tableName: datasetId,
      selectFields: ['logs_row_index', 'id'],
      whereConditions: {
        logs_row_index: payload.rows.map((row) => row.logs_row_index),
      },
    });

    logger.info('Logs data copied', {
      elapsedTimeMs: performance.now() - startTime,
      result,
    });

    return Response.json({
      datasetUuid: datasetId,
      logsUuid: logsId,
      logRowsToDatasetRows: result,
    });
  } catch (error) {
    logger.error('Error getting logs data', error);
    return response('Error processing request', 500);
  }
}
