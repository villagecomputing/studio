import { addDataPayloadSchema } from '@/app/api/dataset/[datasetId]/addData/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import DatabaseUtils from '../../DatabaseUtils';
import PrismaClient from '../../prisma';

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

    if (!dataset.id) {
      throw new Error(`Dataset '${datasetName}' not found.`);
    }

    // Get all fields and column names associated with the dataset
    const columns = await PrismaClient.column.findMany({
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
      Object.keys(datasetRow).map((datasetColumn) => {
        const field =
          columns.find(
            (column) =>
              column.name.toLowerCase() === datasetColumn.toLowerCase(),
          )?.field || datasetColumn;
        sanitizedRow[field] = datasetRow[datasetColumn];
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
