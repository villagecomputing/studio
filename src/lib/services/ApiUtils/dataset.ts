import {
  DatasetRow,
  TableColumnProps,
} from '@/app/(authenticated)/data/[datasetId]/types';
import { getColumnFieldFromNameAndIndex } from '@/app/(authenticated)/data/[datasetId]/utils/commonUtils';
import { editDatasetCellSchema } from '@/app/api/dataset/edit/cell/schema';
import { editDatasetColumnSchema } from '@/app/api/dataset/edit/column/schema';
import {
  ApiEndpoints,
  PayloadSchemaType,
  ResultSchemaType,
} from '@/lib/routes/routes';
import { guardStringEnum } from '@/lib/typeUtils';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { Prisma } from '@prisma/client';
import DatasetParser from '../DatasetParser';
import FileHandler from '../FileHandler';
import PrismaClient from '../prisma';

async function getDatasetDetails(datasetId: number) {
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
    file_size: true,
    file_type: true,
    created_at: true,
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

export async function getDataset(
  datasetId: number,
): Promise<ResultSchemaType['/api/dataset']> {
  if (!datasetId) {
    throw new Error('DatasetId is required');
  }
  // Get database details about dataset
  const datasetDetails = await getDatasetDetails(datasetId);
  if (!datasetDetails) {
    throw new Error('No dataset for id');
  }
  // Get disk content of the dataset
  const fileContent = await FileHandler.getFile(datasetDetails.file_location);

  if (!fileContent) {
    throw new Error('No file content');
  }
  // Parse File content to an object
  const fileContentObject = await DatasetParser.parseAsObject(fileContent);

  // Map the columns
  const columns = datasetDetails.Dataset_column.map(
    (column, index): TableColumnProps => {
      return {
        name: column.name,
        id: column.id,
        field: getColumnFieldFromNameAndIndex(column.name, index),
        type: guardStringEnum(ENUM_Column_type, column.type),
      };
    },
  );

  // Map the rows and modify the content if the column is ground truth
  const rows = fileContentObject.rows.map((row, rowIndex) => {
    const updatedRow: DatasetRow = Object.fromEntries(
      Object.entries(row).map(([key, value], index) => {
        const header = getColumnFieldFromNameAndIndex(
          key || `column_${index}`,
          index,
        );
        return [header, value];
      }),
    );

    datasetDetails.Dataset_column.forEach((column, index) => {
      if (column.type === ENUM_Column_type.GROUND_TRUTH) {
        const field = getColumnFieldFromNameAndIndex(column.name, index);
        const groundTruthCell = column.Ground_truth_cell[rowIndex];
        updatedRow[field] = {
          content: groundTruthCell.content,
          id: groundTruthCell.id,
          status: groundTruthCell.status as ENUM_Ground_truth_status,
        };
      }
    });

    return updatedRow;
  });

  return {
    id: datasetDetails.id,
    file_location: datasetDetails.file_location,
    file_name: datasetDetails.file_name,
    total_rows: datasetDetails.total_rows,
    file_size: datasetDetails.file_size,
    file_type: datasetDetails.file_type,
    created_at: datasetDetails.created_at,
    columns,
    rows,
  };
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
