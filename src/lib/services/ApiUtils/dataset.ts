import { editDatasetCellSchema } from '@/app/api/dataset/edit/cell/schema';
import { editDatasetColumnSchema } from '@/app/api/dataset/edit/column/schema';
import { PayloadSchemaType } from '@/lib/routes/routes';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { Prisma } from '@prisma/client';
import PrismaClient from '../prisma';

export async function getDatasetDetails(datasetId: number) {
  const groundTruthSelect = {
    id: true,
    status: true,
    content: true,
    column_id: true,
  } satisfies Prisma.Ground_truth_cellSelect;

  const columnSelect = {
    id: true,
    name: true,
    type: true,
    index: true,
    Ground_truth_cell: { select: groundTruthSelect },
  } satisfies Prisma.Dataset_columnSelect;

  const datasetSelect = {
    id: true,
    file_location: true,
    file_name: true,
    total_rows: true,
    Dataset_column: { select: columnSelect, where: { deleted_at: null } },
  } satisfies Prisma.DatasetSelect;

  try {
    const result = await PrismaClient.dataset.findUniqueOrThrow({
      where: { id: Number(datasetId), deleted_at: null },
      select: datasetSelect,
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get Dataset details');
  }
}

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

    const updateData = {
      content,
      status,
    };

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
