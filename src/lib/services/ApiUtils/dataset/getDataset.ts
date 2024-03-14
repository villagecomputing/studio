import {
  DatasetRow,
  TableColumnProps,
} from '@/app/(authenticated)/data/[datasetId]/types';
import { DISPLAYABLE_DATASET_COLUMN_TYPES } from '@/lib/constants';
import { ResultSchemaType } from '@/lib/routes/routes';
import { guardStringEnum } from '@/lib/typeUtils';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { Prisma } from '@prisma/client';
import { sortBy } from 'lodash';
import DatabaseUtils from '../../DatabaseUtils';
import PrismaClient from '../../prisma';
import { getGroundTruthStatusColumnName } from './utils';

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

async function getDatasetContent(datasetName: string) {
  if (!datasetName) {
    throw new Error('DatasetName is required');
  }
  const result =
    await DatabaseUtils.select<Record<string, string>>(datasetName);
  return result;
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
  const columns = sortBy(datasetDetails.Column, 'index')
    .filter((column) =>
      DISPLAYABLE_DATASET_COLUMN_TYPES.includes(
        guardStringEnum(ENUM_Column_type, column.type),
      ),
    )
    .map((column): TableColumnProps => {
      return {
        name: column.name,
        id: column.id,
        field: column.field,
        type: guardStringEnum(ENUM_Column_type, column.type),
      };
    });

  const groundTruthFields = datasetDetails.Column.filter(
    (column) => column.type === ENUM_Column_type.GROUND_TRUTH,
  ).map((column) => column.field);

  if (!groundTruthFields.length) {
    throw new Error('Dataset has no ground truth columns');
  }

  const rows: DatasetRow[] = datasetContent.map((row) => {
    const rowWithGroundTruth: DatasetRow = { ...row };
    groundTruthFields.forEach((groundTruthField) => {
      const groundTruthStatus =
        row[getGroundTruthStatusColumnName(groundTruthField)];
      rowWithGroundTruth[groundTruthField] = {
        content: row[groundTruthField] as string,
        id: Number(row['id']),
        status: guardStringEnum(ENUM_Ground_truth_status, groundTruthStatus),
      };
    });
    return rowWithGroundTruth;
  });

  return {
    id: datasetDetails.id,
    name: datasetDetails.name,
    created_at: datasetDetails.created_at,
    columns,
    rows,
  };
}
