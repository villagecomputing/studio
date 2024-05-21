import { addDataPayloadSchema } from '@/app/api/dataset/[datasetId]/addData/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { isSomeStringEnum } from '@/lib/typeUtils';
import { ENUM_Column_type } from '@/lib/types';
import DatabaseUtils from '../../DatabaseUtils';
import { getDatasetOrThrow } from '../../DatabaseUtils/common';
import PrismaClient from '../../prisma';
import {
  API_SCHEMA_PROP_TO_DB_STATIC_FIELD_MAPPING,
  Enum_Dynamic_dataset_static_fields,
} from './utils';

export async function addData({
  datasetId,
  payload,
}: {
  datasetId: string;
  payload: PayloadSchemaType[ApiEndpoints.datasetAddData];
}) {
  const { datasetRows } = addDataPayloadSchema.parse(payload);
  try {
    await getDatasetOrThrow(datasetId);
    // Get all fields and column names associated with the dataset
    const existingColumns = await PrismaClient.dataset_column.findMany({
      select: {
        name: true,
        field: true,
        type: true,
      },
      where: {
        dataset_uuid: datasetId,
        type: {
          notIn: [
            ENUM_Column_type.IDENTIFIER,
            ENUM_Column_type.GROUND_TRUTH_STATUS,
          ],
        },
      },
    });

    const columnNames = existingColumns.map((col) => col.name);
    // Log the column names in a pretty format
    const invalidRows = datasetRows.filter((row) => {
      const rowKeys = Object.keys(row);

      return rowKeys.some((key) => {
        if (isSomeStringEnum(Enum_Dynamic_dataset_static_fields, key)) {
          return false;
        }

        return !!key && !columnNames.includes(key);
      });
    });

    if (invalidRows.length > 0) {
      throw new Error(
        'Some rows contain keys that do not exist in the existing columns',
      );
    }

    // replace the column names from the dataset with the field id
    const sanitizedRows = datasetRows.map((datasetRow) => {
      const sanitizedRow: Record<string, string | Date | null | number> = {};

      existingColumns.forEach((existingColumn) => {
        if (
          existingColumn.field === Enum_Dynamic_dataset_static_fields.CREATED_AT
        ) {
          sanitizedRow[existingColumn.field] = new Date(
            datasetRow[existingColumn.name] || Date.now(),
          );
          return;
        }

        if (
          existingColumn.field ===
          API_SCHEMA_PROP_TO_DB_STATIC_FIELD_MAPPING[
            Enum_Dynamic_dataset_static_fields.ROW_ID
          ]
        ) {
          sanitizedRow[existingColumn.field] = datasetRow.row_id;
          return;
        }

        sanitizedRow[existingColumn.field] =
          datasetRow[existingColumn.name] || '';
      });

      return sanitizedRow;
    });

    const result = await DatabaseUtils.insert(datasetId, sanitizedRows);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error inserting data');
  }
}
