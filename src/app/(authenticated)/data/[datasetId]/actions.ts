'use server';
import { ParserError } from '@/lib/services/DatasetParser';

import ApiUtils from '@/lib/services/ApiUtils';

import { isSomeStringEnum } from '@/lib/typeUtils';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { permanentRedirect } from 'next/navigation';
import { FetchDatasetResult } from './types';
import { convertToAGGridData } from './utils/gridUtils';

export const fetchDataSet = async (
  datasetId: number,
): Promise<FetchDatasetResult | null> => {
  try {
    if (!Number(datasetId)) {
      permanentRedirect('/data');
    }
    const dataset = await ApiUtils.getDataset(datasetId);

    return {
      datasetName: dataset.name,
      ...convertToAGGridData({
        datasetId: dataset.id,
        columns: dataset.columns,
        rows: dataset.rows,
      }),
    };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error((error as ParserError).message);
  }
};

export const markColumnAsType = async (
  columnId: number,
  type: ENUM_Column_type,
): Promise<number | null> => {
  if (!columnId || !isSomeStringEnum(ENUM_Column_type, type)) {
    return null;
  }
  try {
    const updatedColumnId = await ApiUtils.editDatasetColumn({
      columnId,
      type,
    });

    return updatedColumnId;
  } catch (error) {
    return null;
  }
};

export const updateGTCell = async (
  id: number,
  content: string,
  status: string,
) => {
  if (!isSomeStringEnum(ENUM_Ground_truth_status, status)) {
    throw new Error('Wrong cell status');
  }
  try {
    const updatedCellId = await ApiUtils.editDatasetCell({
      groundTruthCellId: id,
      content,
      status,
    });

    return updatedCellId;
  } catch (error) {
    return null;
  }
};

export const approveAll = async (datasetId: number) => {
  try {
    await ApiUtils.approveAll({ datasetId });
  } catch (error) {
    console.error(error);
    throw new Error('Error approving all');
  }
};
