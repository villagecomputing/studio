import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { ENUM_Ground_truth_status } from '@/lib/types';
import DatabaseUtils from '../../DatabaseUtils';
import { getDatasetOrThrow } from '../../DatabaseUtils/common';
import { getGTColumnField, getGroundTruthStatusColumnName } from './utils';

export async function approveAll(
  payload: PayloadSchemaType[ApiEndpoints.datasetApproveAll],
) {
  const { datasetId } = payload;
  try {
    await getDatasetOrThrow(datasetId);
    const groundTruthColumnField = await getGTColumnField(datasetId);

    await DatabaseUtils.update({
      tableName: datasetId,
      setValues: {
        [getGroundTruthStatusColumnName(groundTruthColumnField)]:
          ENUM_Ground_truth_status.APPROVED,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error updating all ground truth cells status');
  }
}
