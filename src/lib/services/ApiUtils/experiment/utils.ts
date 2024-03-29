import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/utils/commonUtils';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { exhaustiveCheck, guardStringEnum } from '@/lib/typeUtils';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import { Experiment, Experiment_column } from '@prisma/client';
import { compact } from 'lodash';
import DatabaseUtils from '../../DatabaseUtils';
import {
  ColumnDefinition,
  ColumnType,
  ENUM_ORDER_DIRECTION,
} from '../../DatabaseUtils/types';

export type ExperimentField = { value?: string } & Pick<
  Experiment_column,
  'name' | 'field' | 'type'
>;
export type ExperimentUpdatableMetadata = Pick<
  Experiment,
  | 'latency_p50'
  | 'latency_p90'
  | 'total_cost'
  | 'total_accuracy'
  | 'total_rows'
  | 'total_latency'
>;

export type RowMetadata = {
  row_latency: number;
  row_cost: number;
};

export const DEFAULT_ROW_METADATA_VALUES = {
  row_latency: 0,
  row_cost: 0,
};

export enum Enum_Dynamic_experiment_metadata_fields {
  LATENCY = 'latency',
  ACCURACY = 'accuracy',
  COST = 'cost',
}

export function buildExperimentFields(
  payload: PayloadSchemaType[ApiEndpoints.experimentInsert],
): ExperimentField[] {
  const experimentFields: ExperimentField[] = [
    {
      name: 'id',
      field: 'id',
      type: Enum_Experiment_Column_Type.IDENTIFIER,
    },
  ];

  let rowLatency = 0;
  let rowCost = 0;
  payload.steps
    .map((step) => {
      rowLatency += step.metadata.latency;
      rowCost +=
        (step.metadata.input_cost ?? 0) + (step.metadata.output_cost ?? 0);
      return [
        {
          name: step.name,
          type: Enum_Experiment_Column_Type.STEP_METADATA,
          value: JSON.stringify(step.metadata),
        },
        ...step.outputs.map((output) => ({
          name: output.name,
          type: Enum_Experiment_Column_Type.OUTPUT,
          value: output.value,
        })),
      ];
    })
    .flatMap((fields) => fields)
    .forEach((field, index) =>
      experimentFields.push({
        name: field.name,
        field: getColumnFieldFromNameAndIndex(field.name, index),
        value: field.value,
        type: field.type,
      }),
    );

  experimentFields.push(
    {
      name: Enum_Dynamic_experiment_metadata_fields.LATENCY,
      field: Enum_Dynamic_experiment_metadata_fields.LATENCY,
      type: Enum_Experiment_Column_Type.METADATA,
      value: rowLatency.toString(),
    },
    {
      name: Enum_Dynamic_experiment_metadata_fields.ACCURACY,
      field: Enum_Dynamic_experiment_metadata_fields.ACCURACY,
      type: Enum_Experiment_Column_Type.METADATA,
      value: (payload.accuracy ?? 0).toString(),
    },
    {
      name: Enum_Dynamic_experiment_metadata_fields.COST,
      field: Enum_Dynamic_experiment_metadata_fields.COST,
      type: Enum_Experiment_Column_Type.METADATA,
      value: rowCost.toString(),
    },
  );

  return experimentFields;
}

export function buildExperimentColumnDefinition(
  experimentFields: ExperimentField[],
): ColumnDefinition[] {
  return compact(
    experimentFields.map((field) => {
      const type = guardStringEnum(Enum_Experiment_Column_Type, field.type);
      switch (type) {
        case Enum_Experiment_Column_Type.IDENTIFIER:
          return {
            isAutoincrement: true,
            type: ColumnType.INTEGER,
            isNotNull: true,
            name: field.field,
            isPrimaryKey: true,
          };
        case Enum_Experiment_Column_Type.OUTPUT:
        case Enum_Experiment_Column_Type.STEP_METADATA:
        case Enum_Experiment_Column_Type.METADATA:
          return {
            type: ColumnType.TEXT,
            name: field.field,
          };
        case Enum_Experiment_Column_Type.ROW_METADATA:
          // For FE use only: Type of 'Metadata' column
          return null;
        default:
          exhaustiveCheck(type);
      }
    }),
  );
}

export function calculatePercentile(
  data: number[],
  percentile: number,
): number {
  // Step 1: Sort the dataset in ascending order
  const sortedData = data.sort((a, b) => a - b);

  // Step 2: Calculate the position of the percentile
  const position = (percentile / 100) * (sortedData.length + 1);
  // Step 3: Check if position is an integer
  if (Number.isInteger(position)) {
    // If position is an integer, return the value at that position
    return sortedData[position - 1];
  } else {
    // If position is not an integer, interpolate between the values at the nearest ranked positions
    const lowerIndex = Math.floor(position);
    const upperIndex = Math.min(Math.ceil(position), sortedData.length);
    const lowerValue = sortedData[lowerIndex - 1];
    const upperValue = sortedData[upperIndex - 1];
    const interpolatedValue =
      lowerValue + (upperValue - lowerValue) * (position - lowerIndex);
    return interpolatedValue || 0;
  }
}

export async function getOrderedExperimentMetadata(
  experimentId: string,
  metadataField: Enum_Dynamic_experiment_metadata_fields,
): Promise<number[]> {
  if (!experimentId) {
    throw new Error('experimentTableName is required');
  }

  const selectFields = [metadataField];
  const orderBy = {
    field: metadataField,
    direction: ENUM_ORDER_DIRECTION.ASC,
  };

  try {
    const result = await DatabaseUtils.select<Record<string, string>>(
      experimentId,
      selectFields,
      undefined,
      orderBy,
    );
    return result.map((row) => {
      return Number(row[metadataField]);
    });
  } catch (error) {
    // Check if the error is because the table doesn't exist
    if (error instanceof Error && 'code' in error && error.code === 'P2010') {
      return [];
    } else {
      throw error;
    }
  }
}
