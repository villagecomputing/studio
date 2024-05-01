import { addDataPayloadSchema } from '@/app/api/dataset/[datasetId]/addData/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { ENUM_Column_type } from '@/lib/types';
import DatabaseUtils from '../../DatabaseUtils';
import { getDatasetOrThrow } from '../../DatabaseUtils/common';
import PrismaClient from '../../prisma';
import { Enum_Dynamic_dataset_static_fields } from './utils';

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
    const lowerCaseRowRecords = datasetRows.map((row) => {
      const record: Record<string, string | Date> = {};
      for (const key in row) {
        record[key.toLowerCase()] = row[key];
      }
      return record;
    });
    const invalidRows = lowerCaseRowRecords.filter((row) => {
      const rowKeys = Object.keys(row);
      return rowKeys.some(
        (key) =>
          !!key && !columnNames.map((name) => name.toLowerCase()).includes(key),
      );
    });
    if (invalidRows.length > 0) {
      throw new Error(
        'Some rows contain keys that do not exist in the existing columns',
      );
    }

    // replace the column names from the dataset with the field id
    const sanitizedRows = lowerCaseRowRecords.map((datasetRow) => {
      const sanitizedRow: Record<string, string | Date> = {};

      existingColumns.forEach((existingColumn) => {
        if (
          existingColumn.field !== Enum_Dynamic_dataset_static_fields.CREATED_AT
        ) {
          sanitizedRow[existingColumn.field] =
            datasetRow[existingColumn.name.toLowerCase()] || '';
          return;
        }

        sanitizedRow[existingColumn.field] = new Date(
          datasetRow[existingColumn.name.toLowerCase()] || Date.now(),
        );
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
