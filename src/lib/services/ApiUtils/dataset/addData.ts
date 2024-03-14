import { addDataPayloadSchema } from '@/app/api/dataset/[datasetId]/addData/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import DatabaseUtils from '../../DatabaseUtils';

export async function addData(
  payload: PayloadSchemaType[ApiEndpoints.datasetAddData],
) {
  const { datasetName, datasetRows } = addDataPayloadSchema.parse(payload);
  try {
    // TODO: sanitize column names. otherwise we would be trying to insert values for ColumnName instead of ColumnName_index
    const result = await DatabaseUtils.insert(datasetName, datasetRows);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error inserting data');
  }
}
