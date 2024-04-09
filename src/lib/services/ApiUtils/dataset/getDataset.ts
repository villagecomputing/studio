import {
  DatasetRow,
  DatasetTableColumnProps,
} from '@/app/(authenticated)/data/[datasetId]/types';
import { DISPLAYABLE_DATASET_COLUMN_TYPES } from '@/lib/constants';
import { ApiEndpoints, ResultSchemaType } from '@/lib/routes/routes';
import { guardStringEnum } from '@/lib/typeUtils';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { Prisma } from '@prisma/client';
import { sortBy } from 'lodash';
import { getDatasetOrThrow } from '../../DatabaseUtils/common';
import PrismaClient from '../../prisma';
import { getDynamicTableContent } from '../common/getDynamicTableContent';
import { getGroundTruthStatusColumnName } from './utils';

async function getDatasetDetails(datasetId: string) {
  const columnSelect = {
    id: true,
    name: true,
    type: true,
    index: true,
    field: true,
  } satisfies Prisma.Dataset_columnSelect;

  const datasetSelect = {
    uuid: true,
    created_at: true,
    name: true,
    Dataset_column: { select: columnSelect, where: { deleted_at: null } },
  } satisfies Prisma.DatasetSelect;

  try {
    const result = await PrismaClient.dataset.findUniqueOrThrow({
      where: { uuid: datasetId, deleted_at: null },
      select: datasetSelect,
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get Dataset details');
  }
}

async function getDatasetContent(datasetId: string) {
  if (!datasetId) {
    throw new Error('DatasetId is required');
  }
  // Ensure the dataset exists and throw an error if not
  await getDatasetOrThrow(datasetId);
  // Retrieve the dataset table content from the database as a record with string values
  const result = await getDynamicTableContent(datasetId);
  return result;
}

export async function getDataset(
  datasetId: string,
): Promise<ResultSchemaType[ApiEndpoints.datasetView]> {
  if (!datasetId) {
    throw new Error('DatasetId is required');
  }
  // Get database details about dataset
  const datasetDetails = await getDatasetDetails(datasetId);
  if (!datasetDetails) {
    throw new Error('No dataset for id');
  }

  // Get database dataset content
  const datasetContent = await getDatasetContent(datasetId);

  // Map the columns
  const columns = sortBy(datasetDetails.Dataset_column, 'index')
    .filter((column) =>
      DISPLAYABLE_DATASET_COLUMN_TYPES.includes(
        guardStringEnum(ENUM_Column_type, column.type),
      ),
    )
    .map((column): DatasetTableColumnProps => {
      return {
        name: column.name,
        id: column.id,
        field: column.field,
        type: guardStringEnum(ENUM_Column_type, column.type),
      };
    });

  const groundTruthFields = datasetDetails.Dataset_column.filter(
    (column) => column.type === ENUM_Column_type.GROUND_TRUTH,
  ).map((column) => column.field);

  if (!groundTruthFields.length) {
    throw new Error('Dataset has no ground truth columns');
  }

  const rows: DatasetRow[] = datasetContent.map((row) => {
    const rowWithGroundTruth: DatasetRow = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key, String(value)]),
    );
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
    id: datasetDetails.uuid,
    name: datasetDetails.name,
    created_at: datasetDetails.created_at,
    columns,
    rows,
  };
}
