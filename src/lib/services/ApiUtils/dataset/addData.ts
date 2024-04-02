import { addDataPayloadSchema } from '@/app/api/dataset/[datasetId]/addData/schema';
import { DISPLAYABLE_DATASET_COLUMN_TYPES } from '@/lib/constants';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import DatabaseUtils from '../../DatabaseUtils';
import { getDatasetOrThrow } from '../../DatabaseUtils/common';
import PrismaClient from '../../prisma';

export async function addData(
  datasetId: string,
  payload: PayloadSchemaType[ApiEndpoints.datasetAddData],
) {
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
          in: DISPLAYABLE_DATASET_COLUMN_TYPES,
        },
      },
    });

    const columnNames = existingColumns.map((col) => col.name);
    const invalidRows = datasetRows.filter(
      (row) => !Object.keys(row).every((key) => columnNames.includes(key)),
    );

    if (invalidRows.length > 0) {
      throw new Error(
        'Some rows contain keys that do not exist in the existing columns',
      );
    }

    // replace the column names from the dataset with the field id
    const sanitizedRows = datasetRows.map((datasetRow) => {
      const sanitizedRow: Record<string, string> = {};

      existingColumns.forEach((existingColumn) => {
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
