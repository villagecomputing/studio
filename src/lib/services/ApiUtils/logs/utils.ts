import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/utils/commonUtils';
import { experimentStepOutputMapping } from '@/app/api/experiment/[experimentId]/insert/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { exhaustiveCheck, guardStringEnum } from '@/lib/typeUtils';
import { Enum_Logs_Column_Type } from '@/lib/types';
import { arrayContainsArray } from '@/lib/utils';
import { compact } from 'lodash';
import { z } from 'zod';
import { ColumnDefinition, ColumnType } from '../../DatabaseUtils/types';
import PrismaClient from '../../prisma';
import { Enum_Dynamic_experiment_metadata_fields } from '../experiment/utils';

const INPUTS_COLUMN = 'inputs';
type LogsField = {
  value?: string | null;
  name: string;
  field: string;
  type: Enum_Logs_Column_Type;
};

export function buildLogsFields(
  payload: PayloadSchemaType[ApiEndpoints.logsInsert],
): LogsField[] {
  let rowLatency = 0;
  let rowCost = 0;
  let outputCounter = 0; // Initialize a counter for outputs to ensure unique indexing
  const experimentFields: LogsField[] = [
    {
      name: 'id',
      field: 'id',
      type: Enum_Logs_Column_Type.IDENTIFIER,
    },
    {
      name: 'created_at',
      field: 'created_at',
      type: Enum_Logs_Column_Type.TIMESTAMP,
    },
    {
      name: INPUTS_COLUMN,
      field: INPUTS_COLUMN,
      type: Enum_Logs_Column_Type.INPUT,
      value: JSON.stringify(payload.inputs),
    },
    ...payload.steps.flatMap((step) => {
      rowLatency += step.metadata.latency;
      rowCost +=
        (step.metadata.input_cost ?? 0) + (step.metadata.output_cost ?? 0);

      // Calculate output fields with indices first
      const outputFieldsWithIndices = step.outputs.map((output) => {
        const fieldIndex = outputCounter++;
        return {
          name: output.name,
          field: getColumnFieldFromNameAndIndex(output.name, fieldIndex),
          type: Enum_Logs_Column_Type.OUTPUT,
          value: output.value,
        };
      });

      // Use the calculated indices for output_column_fields
      const stepMetadata: z.infer<typeof experimentStepOutputMapping> =
        Object.assign(step.metadata, {
          output_column_fields: outputFieldsWithIndices.map(
            (outputField) => outputField.field,
          ),
        });

      return [
        {
          name: step.name,
          field: getColumnFieldFromNameAndIndex(step.name, outputCounter++),
          type: Enum_Logs_Column_Type.STEP_METADATA,
          value: JSON.stringify(stepMetadata),
        },
        ...outputFieldsWithIndices.map((outputField) => ({
          name: outputField.name,
          field: outputField.field,
          type: outputField.type,
          value: outputField.value,
        })),
      ];
    }),
  ];

  experimentFields.push(
    {
      name: Enum_Dynamic_experiment_metadata_fields.LATENCY,
      field: Enum_Dynamic_experiment_metadata_fields.LATENCY,
      type: Enum_Logs_Column_Type.METADATA,
      value: rowLatency.toString(),
    },
    {
      name: Enum_Dynamic_experiment_metadata_fields.ACCURACY,
      field: Enum_Dynamic_experiment_metadata_fields.ACCURACY,
      type: Enum_Logs_Column_Type.METADATA,
      value: payload.accuracy == null ? null : payload.accuracy.toString(),
    },
    {
      name: Enum_Dynamic_experiment_metadata_fields.COST,
      field: Enum_Dynamic_experiment_metadata_fields.COST,
      type: Enum_Logs_Column_Type.METADATA,
      value: rowCost.toString(),
    },
  );

  return experimentFields;
}

export function buildLogsColumnDefinition(
  logsFields: LogsField[],
): ColumnDefinition[] {
  return compact(
    logsFields.map((field) => {
      const type = guardStringEnum(Enum_Logs_Column_Type, field.type);
      switch (type) {
        case Enum_Logs_Column_Type.IDENTIFIER:
          return {
            isAutoincrement: true,
            type: ColumnType.INTEGER,
            isNotNull: true,
            name: field.field,
            isPrimaryKey: true,
          };
        case Enum_Logs_Column_Type.TIMESTAMP:
          return {
            type: ColumnType.DATETIME,
            name: field.field,
            defaultValue: 'CURRENT_TIMESTAMP',
            isNotNull: true,
          };
        case Enum_Logs_Column_Type.INPUT:
        case Enum_Logs_Column_Type.OUTPUT:
        case Enum_Logs_Column_Type.STEP_METADATA:
        case Enum_Logs_Column_Type.METADATA:
          return {
            type: ColumnType.TEXT,
            name: field.field,
          };

        case Enum_Logs_Column_Type.ROW_METADATA:
          // For FE use only: Type of 'Metadata' column
          return null;
        default:
          exhaustiveCheck(type);
      }
    }),
  );
}

export async function isFirstTimeLogsInsert(
  id: string,
  fieldsToCheck: string[],
): Promise<boolean> {
  const existingFields = (
    await PrismaClient.logs_column.findMany({
      select: {
        field: true,
      },
      where: {
        logs_uuid: id,
      },
    })
  ).map((column) => column.field);

  if (existingFields.length === 0) {
    return true;
  }

  // A table is already created but with different fields.
  if (!arrayContainsArray(existingFields, fieldsToCheck)) {
    throw new Error('Cannot insert due to invalid fields');
  }

  return false;
}
