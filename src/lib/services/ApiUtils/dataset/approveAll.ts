import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { getDatasetNameAndGTColumnField } from './utils';

export async function approveAll(
  payload: PayloadSchemaType[ApiEndpoints.datasetApproveAll],
) {
  const { datasetId } = payload;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { datasetName, groundTruthColumnField } =
      await getDatasetNameAndGTColumnField(datasetId);

    // TODO: update ${groundTruthColumnField} in ${datasetName} with {status: ENUM_Ground_truth_status.APPROVED}
  } catch (error) {
    console.error(error);
    throw new Error('Error updating all ground truth cells status');
  }
}
