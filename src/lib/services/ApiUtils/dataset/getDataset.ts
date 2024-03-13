import {
  DatasetRow,
  TableColumnProps,
} from '@/app/(authenticated)/data/[datasetId]/types';
import { ResultSchemaType } from '@/lib/routes/routes';
import { guardStringEnum } from '@/lib/typeUtils';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { Prisma } from '@prisma/client';
import PrismaClient from '../../prisma';

async function getDatasetDetails(datasetId: number) {
  const columnSelect = {
    id: true,
    name: true,
    type: true,
    index: true,
    field: true,
  } satisfies Prisma.ColumnSelect;

  const datasetSelect = {
    id: true,
    created_at: true,
    name: true,
    Column: { select: columnSelect, where: { deleted_at: null } },
  } satisfies Prisma.Dataset_listSelect;

  try {
    const result = await PrismaClient.dataset_list.findUniqueOrThrow({
      where: { id: Number(datasetId), deleted_at: null },
      select: datasetSelect,
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get Dataset details');
  }
}

async function getDatasetContent(datasetName: string): Promise<DatasetRow[]> {
  if (!datasetName) {
    throw new Error('DatasetName is required');
  }
  return [];
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

  // Get database dataset content
  const datasetContent = await getDatasetContent(datasetDetails.name);

  // Map the columns
  const columns = datasetDetails.Column.map((column): TableColumnProps => {
    return {
      name: column.name,
      id: column.id,
      field: column.field,
      type: guardStringEnum(ENUM_Column_type, column.type),
    };
  });

  const groundTruthField = datasetDetails.Column.find(
    (column) => column.type === ENUM_Column_type.GROUND_TRUTH,
  )?.field;

  let rows = datasetContent;
  if (groundTruthField) {
    rows = datasetContent.map((row) => {
      // TODO FIX this
      const rowGroundTruthStatus = ENUM_Ground_truth_status.PENDING;
      const rowId = 0;
      return {
        ...row,
        [groundTruthField]: {
          content: row[groundTruthField] as string,
          id: rowId,
          status: rowGroundTruthStatus,
        },
      };
    });
  }
  // Map the rows and modify the content if the column is ground truth

  return {
    id: datasetDetails.id,
    name: datasetDetails.name,
    created_at: datasetDetails.created_at,
    columns,
    rows,
  };
}
