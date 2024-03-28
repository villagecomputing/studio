import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/utils/commonUtils';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { exhaustiveCheck, guardStringEnum } from '@/lib/typeUtils';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import { Experiment, Experiment_column } from '@prisma/client';
import { compact } from 'lodash';
import { ColumnDefinition, ColumnType } from '../../DatabaseUtils/types';

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
  row_accuracy: number;
};

export const DEFAULT_ROW_METADATA_VALUES = {
  row_latency: 0,
  row_cost: 0,
  row_accuracy: 0,
};

export const DYNAMIC_EXPERIMENT_LATENCY_FIELD = 'latency';

export const assertIsNumber = (value: string | number | null | boolean) => {
  if (
    value === '' ||
    value === undefined ||
    value === null ||
    Number.isNaN(value)
  ) {
    throw new Error('Not a number');
  }
};

export function assertIsMetadataValid(
  metadata: Record<string, string | number | null | boolean>,
) {
  assertIsNumber(metadata.latency);
  assertIsNumber(metadata.cost);
  assertIsNumber(metadata.accuracy);
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
  payload.steps
    .map((step) => {
      assertIsMetadataValid(step.metadata);
      rowLatency += step.metadata.latency;
      return [
        {
          name: step.name,
          type: Enum_Experiment_Column_Type.METADATA,
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

  experimentFields.push({
    name: DYNAMIC_EXPERIMENT_LATENCY_FIELD,
    field: DYNAMIC_EXPERIMENT_LATENCY_FIELD,
    type: Enum_Experiment_Column_Type.OUTPUT,
    value: rowLatency.toString(),
  });

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
        case Enum_Experiment_Column_Type.METADATA:
          return {
            type: ColumnType.TEXT,
            name: field.field,
          };
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
