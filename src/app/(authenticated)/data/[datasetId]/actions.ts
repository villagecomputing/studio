'use server';
import { ParserError } from '@/lib/services/DatasetParser';

import ApiUtils from '@/lib/services/ApiUtils';

import { isSomeStringEnum } from '@/lib/typeUtils';
import { ENUM_Ground_truth_status } from '@/lib/types';

import { auth } from '@clerk/nextjs';
import DatasetGrid from '../utils/DatasetGrid';
import { FetchDatasetResult } from './types';

export const fetchDataSet = async (
  datasetId: string,
): Promise<FetchDatasetResult | null> => {
  try {
    const { userId } = auth();
    const dataset = await ApiUtils.getDataset(datasetId, userId);

    return {
      datasetName: dataset.name,
      ...DatasetGrid.convertToAGGridData({
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

export const updateGTCell = async (
  datasetId: string,
  rowId: number,
  content: string,
  status: string,
) => {
  if (!isSomeStringEnum(ENUM_Ground_truth_status, status)) {
    throw new Error('Wrong cell status');
  }
  try {
    const updatedCellId = await ApiUtils.editGroundTruthCell({
      datasetId,
      rowId,
      content,
      status,
    });

    return updatedCellId;
  } catch (error) {
    console.error(error);
    throw new Error('Error updating ground truth cell');
  }
};

export const approveAll = async (datasetId: string) => {
  try {
    await ApiUtils.approveAll({ datasetId });
  } catch (error) {
    console.error(error);
    throw new Error('Error approving all');
  }
};
