import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import PrismaClient from '../../prisma';

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
    const dataset = await PrismaClient.dataset_list.findUniqueOrThrow({
      where: { id: datasetId },
      select: { name: true },
    });

    const groundTruthColumn = await PrismaClient.column.findFirst({
      where: { dataset_id: datasetId, type: ENUM_Column_type.GROUND_TRUTH },
      select: { field: true },
    });

    if (!groundTruthColumn?.field) {
      throw new Error('Dataset ground truth column field not found');
    }

    const updateData: Record<string, string | ENUM_Ground_truth_status> = {
      ground_truth_status: status,
    };
    if (content) {
      updateData[groundTruthColumn.field] = content;
    }
    // TODO: Update the ${dataset.name} table where id = rowId with the updatedData

    return rowId;
  } catch (error) {
    console.error(error);
    throw new Error('Error updating GT cell');
  }
}
