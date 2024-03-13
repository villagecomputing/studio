import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { ENUM_Ground_truth_status } from '@/lib/types';
import DatabaseUtils from '../../DatabaseUtils';
import {
  getDatasetNameAndGTColumnField,
  getGroundTruthStatusColumnName,
} from './utils';

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

    const { datasetName, groundTruthColumnField } =
      await getDatasetNameAndGTColumnField(datasetId);

    const updateData: Record<string, string | ENUM_Ground_truth_status> = {
      [getGroundTruthStatusColumnName(groundTruthColumnField)]: status,
    };
    if (content) {
      updateData[groundTruthColumnField] = content;
    }

    const updated = await DatabaseUtils.update(datasetName, updateData, {
      id: rowId.toString(),
    });

    return updated;
  } catch (error) {
    console.error(error);
    throw new Error('Error updating GT cell');
  }
}
