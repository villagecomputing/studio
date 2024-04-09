import { response } from '@/app/api/utils';
import { buildRowMetadata } from '@/lib/services/ApiUtils/experiment/updateExperiment';
import {
  Enum_Dynamic_experiment_metadata_fields,
  calculatePercentile,
  getOrderedExperimentMetadata,
} from '@/lib/services/ApiUtils/experiment/utils';
import {
  buildLogsColumnDefinition,
  buildLogsFields,
  isFirstTimeLogsInsert,
} from '@/lib/services/ApiUtils/logs/utils';
import DatabaseUtils from '@/lib/services/DatabaseUtils';
import { getLogsEntryOrThrow } from '@/lib/services/DatabaseUtils/common';
import PrismaClient from '@/lib/services/prisma';
import { Enum_Logs_Column_Type } from '@/lib/types';
import { UUIDPrefixEnum, getUuidFromFakeId } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { insertLogsPayloadSchema } from './schema';

/**
 * @swagger
 * /api/logs/{logsId}/insert:
 *   post:
 *     tags:
 *      - Logs
 *     summary: Inserts data into the logs table with the given Id.
 *     description: Ensures the logs table is created and inserts the given steps as a row for the given logs id
 *     operationId: InsertLogsRow
 *     parameters:
 *       - in: path
 *         name: logsId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogsInsertPayload'
 *     responses:
 *       200:
 *         description: 'Ok'
 *       500:
 *         description: 'Error processing request'
 */
export async function POST(
  request: Request,
  { params }: { params: { logsId: string } },
) {
  try {
    let logsId = params.logsId;
    try {
      logsId = getUuidFromFakeId(logsId, UUIDPrefixEnum.LOGS);
    } catch (_e) {
      return response('Invalid logs id', 400);
    }
    const requestBody = await request.json();
    const payload = insertLogsPayloadSchema.parse(requestBody);

    // create dynamic table if it's first insert
    const logsEntryDetails = await getLogsEntryOrThrow(logsId);
    const logsFields = buildLogsFields(payload);
    const fields = logsFields.map((logsField) => logsField.field);
    if (await isFirstTimeLogsInsert(logsId, fields)) {
      const columnDefinitions = buildLogsColumnDefinition(logsFields);
      try {
        await DatabaseUtils.create(logsId, columnDefinitions);
      } catch (error) {
        console.error('Error creating logs dynamic table:', error);
        return response('Error processing request', 500);
      }
      for (const field of logsFields) {
        await PrismaClient.logs_column.create({
          data: {
            logs_uuid: logsId,
            name: field.name,
            field: field.field,
            type: field.type,
          },
        });
      }
    }

    // insert data in dynamic table
    const valuesByField: Record<string, string | null> = {};
    logsFields
      .filter(
        (field) =>
          field.type !== Enum_Logs_Column_Type.IDENTIFIER &&
          field.type !== Enum_Logs_Column_Type.TIMESTAMP,
      )
      .forEach(
        (stepFieldAndValue) =>
          (valuesByField[stepFieldAndValue.field] =
            stepFieldAndValue.value ?? null),
      );
    try {
      await DatabaseUtils.insert(logsId, [valuesByField]);
    } catch (error) {
      console.error('Error inserting log in dynamic table:', error);
      return response('Error processing request', 500);
    }

    // update logs entry in Logs list table
    const orderedLatencies = await getOrderedExperimentMetadata(
      logsId,
      Enum_Dynamic_experiment_metadata_fields.LATENCY,
    );
    const rowMetadata = buildRowMetadata(payload.steps);
    const updatedData = {
      latency_p50: calculatePercentile(orderedLatencies, 50),
      latency_p90: calculatePercentile(orderedLatencies, 90),
      total_latency: logsEntryDetails.total_latency + rowMetadata.row_latency,
      total_cost: logsEntryDetails.total_cost + rowMetadata.row_cost,
      total_accuracy: logsEntryDetails.total_accuracy + (payload.accuracy ?? 0),
      total_rows: logsEntryDetails.total_rows + 1,
    } satisfies Prisma.LogsUpdateInput;
    await PrismaClient.logs.update({
      where: { uuid: logsId },
      data: updatedData,
    });
    return response('Ok');
  } catch (error) {
    console.error('Error on POST insert log:', error);
    return response('Error processing request', 500);
  }
}
