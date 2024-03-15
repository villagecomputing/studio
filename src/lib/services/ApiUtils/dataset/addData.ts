import { addDataPayloadSchema } from '@/app/api/dataset/[datasetId]/addData/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import DatabaseUtils from '../../DatabaseUtils';
import PrismaClient from '../../prisma';
import { DEFAULT_COLUMN_NAME_PREFIX } from './utils';

export async function addData(
  payload: PayloadSchemaType[ApiEndpoints.datasetAddData],
) {
  const { datasetName, datasetRows } = addDataPayloadSchema.parse(payload);
  try {
    const dataset = await PrismaClient.dataset_list.findFirstOrThrow({
      where: {
        name: datasetName,
      },
    });

    // Get all fields and column names associated with the dataset
    const existingColumns = await PrismaClient.column.findMany({
      select: {
        name: true,
        field: true,
      },
      where: {
        dataset_id: dataset.id,
      },
    });

    // replace the column names from the dataset with the field id
    const sanitizedRows = datasetRows.map((datasetRow) => {
      const sanitizedRow: Record<string, string> = {};
      Object.keys(datasetRow).map((datasetColumn, index) => {
        const fieldToUpdate = !!datasetColumn
          ? existingColumns.find(
              (existingColumn) =>
                existingColumn.name.toLowerCase() ===
                datasetColumn.toLowerCase(),
            )?.field
          : existingColumns.find((existingColumn) =>
              existingColumn.field
                .toLowerCase()
                .startsWith(
                  `${DEFAULT_COLUMN_NAME_PREFIX}${index}`.toLowerCase(),
                ),
            )?.field;

        if (!fieldToUpdate) {
          throw new Error(
            `Field ${datasetColumn} does not exist in the database`,
          );
        }
        sanitizedRow[fieldToUpdate] = datasetRow[datasetColumn];
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
