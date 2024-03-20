import { addDataPayloadSchema } from '@/app/api/dataset/[datasetId]/addData/schema';
import { DISPLAYABLE_DATASET_COLUMN_TYPES } from '@/lib/constants';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import DatabaseUtils from '../../DatabaseUtils';
import PrismaClient from '../../prisma';

export async function addData(
  payload: PayloadSchemaType[ApiEndpoints.datasetAddData],
) {
  const { datasetName, datasetRows } = addDataPayloadSchema.parse(payload);
  try {
    const dataset = await PrismaClient.dataset.findFirstOrThrow({
      where: {
        name: datasetName,
      },
    });

    // Get all fields and column names associated with the dataset
    const existingColumns = await PrismaClient.dataset_column.findMany({
      select: {
        name: true,
        field: true,
      },
      where: {
        dataset_uuid: dataset.uuid,
        type: {
          in: DISPLAYABLE_DATASET_COLUMN_TYPES,
        },
      },
    });

    // replace the column names from the dataset with the field id
    const sanitizedRows = datasetRows.map((datasetRow) => {
      const sanitizedRow: Record<string, string> = {};

      existingColumns.forEach((existingColumn) => {
        const columnName = existingColumn.name;
        const datasetColumnValue = datasetRow[columnName] || '';

        if (datasetColumnValue !== undefined) {
          sanitizedRow[existingColumn.field] = datasetColumnValue;
        }
      });

      return sanitizedRow;
    });

    const result = await DatabaseUtils.insert(datasetName, sanitizedRows);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error inserting data');
  }
}
