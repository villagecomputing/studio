import ApiUtils from '@/lib/services/ApiUtils';
import { getLogsDetails } from '@/lib/services/ApiUtils/logs/getLogsDetails';
import DatabaseUtils from '@/lib/services/DatabaseUtils';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { Enum_Logs_Column_Type } from '@/lib/types';
import { UUIDPrefixEnum, getUuidFromFakeId } from '@/lib/utils';

import { Enum_Dynamic_dataset_static_fields } from '@/lib/services/ApiUtils/dataset/utils';
import { Enum_Dynamic_logs_static_fields } from '@/lib/services/ApiUtils/logs/utils';

import { withAuthMiddleware } from '@/lib/services/ApiUtils/user/withAuthMiddleware';
import PrismaClient from '@/lib/services/prisma';
import { response } from '../../../utils';
import { logsStepInputs } from '../../insert/schema';
import { logsToDatasetPayloadSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'CopyLogsToDataset',
});

async function buildDatasetRowsPayload(logsId: string, logRowIds: string[]) {
  // Get dynamic logs fields to select
  const logsFields = await PrismaClient.logs_column.findMany({
    where: {
      logs_uuid: logsId,
      OR: [
        { type: Enum_Logs_Column_Type.INPUT },
        { type: Enum_Logs_Column_Type.OUTPUT },
        { type: Enum_Logs_Column_Type.TIMESTAMP },
        { type: Enum_Logs_Column_Type.IDENTIFIER },
      ],
    },
    select: {
      field: true,
      type: true,
    },
  });
  const hasDatasetRowIdColumn = !!(await PrismaClient.logs_column.findFirst({
    where: {
      logs_uuid: logsId,
      field: Enum_Dynamic_logs_static_fields.DATASET_ROW_ID,
    },
  }));

  // Get dynamic logs rows
  const logsRowsToCopy = await DatabaseUtils.select<Record<string, string>>({
    tableName: logsId,
    selectFields: logsFields.map((field) => field.field),
    whereConditions: hasDatasetRowIdColumn
      ? {
          id: logRowIds,
          [Enum_Dynamic_logs_static_fields.DATASET_ROW_ID]: null,
        }
      : { id: logRowIds },
  });

  const rowsWithParsedInputs = logsRowsToCopy.map((row) => {
    const outputs: Record<string, string> = {};
    logsFields
      .filter((field) => field.type === Enum_Logs_Column_Type.OUTPUT)
      .forEach((field) => {
        outputs[field.field] = row[field.field];
      });

    // Process logs row inputs field and convert to Record<string, string>
    const inputs = logsStepInputs.parse(JSON.parse(row.inputs) || []);
    const parsedInputs: Record<string, string> = Object.fromEntries(
      inputs.map((input) => [input.name, input.value]),
    );
    return {
      id: row.id,
      created_at: row.created_at,
      outputs,
      inputs: parsedInputs,
    };
  });

  return rowsWithParsedInputs;
}

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
 *         description: The unique identifier of the logs to copy to the dataset.
 *         example: l-48a3beac-33c1-4c1e-87af-b598029fd42e
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogsToDatasetPayloadSchema'
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
  return withAuthMiddleware(request, async (userId) => {
    const startTime = performance.now();

    // Ensure logs id param is valid
    let logsId = params.logsId;
    try {
      logsId = getUuidFromFakeId(logsId, UUIDPrefixEnum.LOGS);
    } catch (error) {
      logger.warn('Invalid logs id', { logsId, error });
      return response('Invalid logs id', 400);
    }

    let requestBody: string | undefined;
    try {
      requestBody = await request.json();
      const { datasetName, logRowIds } =
        logsToDatasetPayloadSchema.parse(requestBody);

      const logDetails = await getLogsDetails(logsId, userId);

      if (userId && !logDetails) {
        logger.warn('Invalid logsId - userId', { logsId });
        return response('Invalid logs id', 400);
      }

      // Get logs rows to copy and build the dataset payload
      const datasetRowsPayload = await buildDatasetRowsPayload(
        logsId,
        logRowIds,
      );

      if (datasetRowsPayload.length === 0) {
        logger.debug(
          'No valid rows to copy. Specified row indices are either already copied or do not exist in the logs table. ',
          { logDetails, logRowIds },
        );
        return response('No valid rows to copy', 200);
      }

      // Ensure related dataset created
      let datasetId = logDetails.Dataset[0]?.uuid;
      if (!datasetId) {
        const firstRowPayload = datasetRowsPayload[0];
        datasetId = await ApiUtils.newDataset(
          {
            datasetName,
            columns: Object.keys(firstRowPayload.inputs),
            groundTruths: Object.keys(firstRowPayload.outputs),
          },
          userId,
        );

        // Update logs table relationship to the dataset
        await PrismaClient.logs.update({
          where: { uuid: logsId },
          data: {
            Dataset: {
              connect: { uuid: datasetId },
            },
          },
        });
      }

      // Copy logs rows to dataset
      await ApiUtils.addData({
        datasetId,
        payload: {
          datasetRows: datasetRowsPayload.map((row) => {
            return {
              [Enum_Dynamic_dataset_static_fields.LOGS_ROW_ID]:
                row.id.toString(),
              [Enum_Dynamic_dataset_static_fields.CREATED_AT]: row.created_at,
              ...row.inputs,
              ...row.outputs,
            };
          }),
        },
      });

      // Select newly created dataset rows
      const datasetRows = await DatabaseUtils.select<Record<string, string>>({
        tableName: datasetId,
        selectFields: [Enum_Dynamic_dataset_static_fields.LOGS_ROW_ID, 'id'],
        whereConditions: {
          logs_row_id: logRowIds,
        },
      });

      if (
        logDetails.Logs_column.some(
          (column) =>
            column.field === Enum_Dynamic_logs_static_fields.DATASET_ROW_ID,
        )
      ) {
        // Update dataset row index in the dynamic logs table
        await Promise.all(
          datasetRows.map((row) => {
            return DatabaseUtils.update({
              tableName: logsId,
              setValues: {
                [Enum_Dynamic_logs_static_fields.DATASET_ROW_ID]: row.id,
              },
              whereConditions: {
                id: row.logs_row_id,
              },
            });
          }),
        );
      }

      logger.info('Logs data copied', {
        elapsedTimeMs: performance.now() - startTime,
        datasetRows,
      });

      return Response.json({
        datasetUuid: datasetId,
        logsUuid: logsId,
        logRowsToDatasetRows: datasetRows,
      });
    } catch (error) {
      logger.error('Error copying logs rows to dataset', error, {
        logsId,
        requestBody,
      });
      return response('Error processing request', 500);
    }
  });
}
