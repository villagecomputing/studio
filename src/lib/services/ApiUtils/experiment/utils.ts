import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/utils/commonUtils';
import { experimentStepOutputMapping } from '@/app/api/experiment/[experimentId]/insert/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { exhaustiveCheck, guardStringEnum } from '@/lib/typeUtils';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import { Experiment, Experiment_column } from '@prisma/client';
import { compact } from 'lodash';
import { z } from 'zod';
import DatabaseUtils from '../../DatabaseUtils';
import {
  ColumnDefinition,
  ColumnType,
  ENUM_ORDER_DIRECTION,
} from '../../DatabaseUtils/types';

export type ExperimentField = { value?: string | null } & Pick<
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
  DATASET_ROW_INDEX = 'dataset_row_index',
}

export function buildExperimentFields(
  payload: PayloadSchemaType[ApiEndpoints.experimentInsert],
): ExperimentField[] {
  let rowLatency = 0;
  let rowCost = 0;
  let outputCounter = 0; // Initialize a counter for outputs to ensure unique indexing
  const experimentFields: ExperimentField[] = [
    {
      name: 'id',
      field: 'id',
      type: Enum_Experiment_Column_Type.IDENTIFIER,
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
          type: Enum_Experiment_Column_Type.OUTPUT,
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
          type: Enum_Experiment_Column_Type.STEP_METADATA,
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
      type: Enum_Experiment_Column_Type.METADATA,
      value: rowLatency.toString(),
    },
    {
      name: Enum_Dynamic_experiment_metadata_fields.ACCURACY,
      field: Enum_Dynamic_experiment_metadata_fields.ACCURACY,
      type: Enum_Experiment_Column_Type.METADATA,
      value: payload.accuracy == null ? null : payload.accuracy.toString(),
    },
    {
      name: Enum_Dynamic_experiment_metadata_fields.COST,
      field: Enum_Dynamic_experiment_metadata_fields.COST,
      type: Enum_Experiment_Column_Type.METADATA,
      value: rowCost.toString(),
    },
    {
      name: Enum_Dynamic_experiment_metadata_fields.DATASET_ROW_INDEX,
      field: Enum_Dynamic_experiment_metadata_fields.DATASET_ROW_INDEX,
      type: Enum_Experiment_Column_Type.METADATA,
      value: payload.index.toString(),
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
  const position = (percentile / 100) * (sortedData.length - 1);

  // Step 3: Check if position is an integer
  if (Number.isInteger(position)) {
    // If position is an integer, return the value at that position
    return sortedData[position] || 0;
  } else {
    // If position is not an integer, interpolate between the values at the nearest ranked positions
    const lowerIndex = Math.floor(position);
    const upperIndex = Math.min(Math.ceil(position), sortedData.length - 1);
    const lowerValue = sortedData[lowerIndex];
    const upperValue = sortedData[upperIndex];
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
