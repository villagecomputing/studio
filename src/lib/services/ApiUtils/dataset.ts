import { editDatasetCellSchema } from '@/app/api/dataset/edit/cell/schema';
import { editDatasetColumnSchema } from '@/app/api/dataset/edit/column/schema';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import PrismaClient from '../prisma';

export async function editDatasetColumn(
  payload: PayloadSchemaType['/api/dataset/edit/column'],
) {
  try {
    const params = editDatasetColumnSchema.parse(payload);
    const { columnId, name, type } = params;

    // Prepare the data for update
    const updateData: { name?: string; type?: ENUM_Column_type } = {};
    if (name) {
      updateData.name = name;
    }
    if (type) {
      updateData.type = type;
    }

    if (type === ENUM_Column_type.GROUND_TRUTH) {
      return columnId;
      // // Remove OLD GT column type
      // const columnData = await PrismaClient.dataset_column.findUnique({
      //   where: {
      //     id: columnId,
      //   },
      // });
      // await PrismaClient.dataset_column.updateMany({
      //   where: {
      //     dataset_id: columnData?.dataset_id,
      //     type: ENUM_Column_type.GROUND_TRUTH,
      //   },
      //   data: {
      //     type: ENUM_Column_type.INPUT,
      //   },
      // });
      // await PrismaClient.ground_truth_cell.deleteMany({
      //   where: {
      //     column_id: columnId,
      //   },
      // });
      // // TODO Add new GT column data
    }

    const updatedColumn = await PrismaClient.dataset_column.update({
      where: { id: columnId },
      data: updateData,
    });

    return updatedColumn.id;
  } catch (error) {
    console.error(error);
    throw new Error('Error updating column');
  }
}

export async function editDatasetCell(
  payload: PayloadSchemaType['/api/dataset/edit/cell'],
) {
  try {
    const params = editDatasetCellSchema.parse(payload);
    const {
      groundTruthCellId,
      content,
      status = ENUM_Ground_truth_status.APPROVED,
    } = params;

    const updateData: { content?: string; status: ENUM_Ground_truth_status } = {
      status,
    };
    if (content) {
      updateData.content = content;
    }

    const updatedCell = await PrismaClient.ground_truth_cell.update({
      where: { id: groundTruthCellId },
      data: updateData,
    });

    return updatedCell.id;
  } catch (error) {
    console.error(error);
    throw new Error('Error updating cell');
  }
}
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
