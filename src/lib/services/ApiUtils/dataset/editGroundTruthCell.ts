import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { ENUM_Ground_truth_status } from '@/lib/types';
import { getDatasetNameAndGTColumnField } from './utils';

export async function editGroundTruthCell(
  payload: PayloadSchemaType[ApiEndpoints.groundTruthCellEdit],
) {
  try {
    const {
      datasetId,
      rowId,
      content,
      status = ENUM_Ground_truth_status.APPROVED,
    } = payload;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { datasetName, groundTruthColumnField } =
      await getDatasetNameAndGTColumnField(datasetId);

    const updateData: Record<string, string | ENUM_Ground_truth_status> = {
      ground_truth_status: status,
    };
    if (content) {
      updateData[groundTruthColumnField] = content;
    }
    // TODO: Update the ${dataset.name} table where id = rowId with the updatedData

    return rowId;
  } catch (error) {
    console.error(error);
    throw new Error('Error updating GT cell');
  }
}
