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
  | 'avg_latency_p50'
  | 'avg_latency_p90'
  | 'total_cost'
  | 'total_accuracy'
  | 'total_rows'
>;

export type RowMetadata = {
  row_latency_p50: number;
  row_latency_p90: number;
  row_cost: number;
  row_accuracy: number;
};

export const DEFAULT_ROW_METADATA_VALUES = {
  row_latency_p50: 0,
  row_latency_p90: 0,
  row_latency: 0,
  row_cost: 0,
  row_accuracy: 0,
};

export const assertIsNumber = (value: string | number) => {
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
  metadata: Record<string, string | number>,
) {
  assertIsNumber(metadata.latencyP50);
  assertIsNumber(metadata.latencyP90);
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

  payload.steps
    .map((step) => {
      assertIsMetadataValid(step.metadata);
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
