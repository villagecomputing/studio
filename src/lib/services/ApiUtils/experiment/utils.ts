import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/utils/commonUtils';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { exhaustiveCheck, guardStringEnum } from '@/lib/typeUtils';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import { Experiment_column } from '@prisma/client';
import { compact } from 'lodash';
import { ColumnDefinition, ColumnType } from '../../DatabaseUtils/types';

export type ExperimentField = { value?: string } & Pick<
  Experiment_column,
  'name' | 'field' | 'type'
>;

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
    .map((step) => [
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
    ])
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
