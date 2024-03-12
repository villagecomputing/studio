import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import PrismaClient from '../prisma';

export async function approveAll(
  payload: PayloadSchemaType[ApiEndpoints.datasetApproveAll],
) {
  const { datasetId } = payload;
  try {
    const column = await PrismaClient.dataset_column.findFirstOrThrow({
      where: {
        dataset_id: Number(datasetId),
        deleted_at: null,
        type: ENUM_Column_type.GROUND_TRUTH,
      },
      select: { id: true },
    });

    await PrismaClient.ground_truth_cell.updateMany({
      where: {
        column_id: column.id,
      },
      data: {
        status: ENUM_Ground_truth_status.APPROVED,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error updating all ground truth cells status');
  }
}
