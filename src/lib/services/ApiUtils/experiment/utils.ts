import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/[datasetId]/utils/commonUtils';
import { exhaustiveCheck, guardStringEnum } from '@/lib/typeUtils';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import { Experiment_column } from '@prisma/client';
import { compact } from 'lodash';
import { ColumnDefinition, ColumnType } from '../../DatabaseUtils/types';

export type ExperimentField = Pick<
  Experiment_column,
  'name' | 'field' | 'type'
>;

export function buildExperimentFields(
  outputFieldsByMetadata: Record<string, string[]>,
): ExperimentField[] {
  const experimentFields: ExperimentField[] = [
    {
      name: 'id',
      field: 'id',
      type: Enum_Experiment_Column_Type.IDENTIFIER,
    },
  ];

  let index = 0;
  Object.entries(outputFieldsByMetadata).flatMap(([metadataName, outputs]) => [
    experimentFields.push({
      name: metadataName,
      field: getColumnFieldFromNameAndIndex(metadataName, index++),
      type: Enum_Experiment_Column_Type.METADATA,
    }),
    outputs.forEach((output) =>
      experimentFields.push({
        name: getMetadataSpecificOutputName(metadataName, output),
        field: getColumnFieldFromNameAndIndex(output, index++),
        type: Enum_Experiment_Column_Type.OUTPUT,
      }),
    ),
  ]);

  return experimentFields;
}

// Experiments can have multiple steps/netadata and each can have multiple outputs
// Ouputs for different metadata can have the same name
// When searching for the field to insert an output to we need to also take into account the metadata name so that we insert the proper value
export function getMetadataSpecificOutputName(
  metadataName: string,
  outputName: string,
) {
  return `${outputName} (${metadataName})`;
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
        case Enum_Experiment_Column_Type.INPUT:
          throw new Error(`Unupported field type: ${field.type}`);
        default:
          exhaustiveCheck(type);
      }
    }),
  );
}
