import ApiUtils from '@/lib/services/ApiUtils';
import { getLogsDetails } from '@/lib/services/ApiUtils/logs/getLogsDetails';
import DatabaseUtils from '@/lib/services/DatabaseUtils';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { Enum_Logs_Column_Type } from '@/lib/types';
import { UUIDPrefixEnum, getUuidFromFakeId } from '@/lib/utils';

import { Enum_Dynamic_dataset_static_fields } from '@/lib/services/ApiUtils/dataset/utils';
import { Enum_Dynamic_experiment_metadata_fields } from '@/lib/services/ApiUtils/experiment/utils';
import PrismaClient from '@/lib/services/prisma';
import { hasApiAccess, response } from '../../../utils';
import { logsStepInputs } from '../../insert/schema';
import { logsToDatasetPayloadSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'CopyLogsToDataset',
});

async function buildDatasetRowsPayload(
  logsId: string,
  logsRowIndices: string[],
) {
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

  // Get dynamic logs rows
  const logsRowsToCopy = await DatabaseUtils.select<Record<string, string>>({
    tableName: logsId,
    selectFields: logsFields.map((field) => field.field),
    whereConditions: {
      id: logsRowIndices,
    },
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
 *         description: The unique identifier of the logs view to retrieve.
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
    const { datasetName, logsRowIndices } =
      logsToDatasetPayloadSchema.parse(requestBody);

    const logDetails = await getLogsDetails(logsId);

    // Get logs rows to copy and build the dataset payload
    const datasetRowsPayload = await buildDatasetRowsPayload(
      logsId,
      logsRowIndices,
    );

    // Ensure related dataset created
    let datasetId = logDetails.Dataset[0]?.uuid;
    if (!datasetId) {
      const firstRowPayload = datasetRowsPayload[0];
      datasetId = await ApiUtils.newDataset({
        datasetName,
        columns: Object.keys(firstRowPayload.inputs),
        groundTruths: Object.keys(firstRowPayload.outputs),
      });

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
            logs_row_id: row.id.toString(),
            created_at: row.created_at,
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
        logs_row_id: logsRowIndices,
      },
    });

    // Update dataset row index in the dynamic logs table
    await Promise.all(
      datasetRows.map((row) => {
        return DatabaseUtils.update({
          tableName: logsId,
          setValues: {
            [Enum_Dynamic_experiment_metadata_fields.DATASET_ROW_ID]: row.id,
          },
          whereConditions: {
            id: row.logs_row_id,
          },
        });
      }),
    );

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
    logger.error('Error copying logs rows to dataset', { error });
    return response('Error processing request', 500);
  }
}
