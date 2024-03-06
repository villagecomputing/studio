'use server';
import DatasetParser, { ParserError } from '@/lib/services/DatasetParser';
import FileHandler from '@/lib/services/FileHandler';

import ApiUtils from '@/lib/services/ApiUtils';
import { guardStringEnum, isSomeStringEnum } from '@/lib/typeUtils';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { permanentRedirect } from 'next/navigation';
import { DatasetRow, FetchDatasetResult, TableColumnProps } from './types';
import { convertToAGGridData, getColumnFieldFromName } from './utils';

export const fetchDataSet = async (
  datasetId: number,
): Promise<FetchDatasetResult | null> => {
  try {
    if (!datasetId) {
      permanentRedirect('/data');
    }
    // Get database details about dataset
    const datasetDetails = await ApiUtils.getDatasetDetails(datasetId);
    if (!datasetDetails) {
      return null;
    }
    // Get disk content of the dataset
    const fileContent = await FileHandler.getFile(datasetDetails.file_location);

    if (!fileContent) {
      return null;
    }
    // Parse File content to an object
    const fileContentObject = await DatasetParser.parseAsObject(fileContent);

    // Map the columns
    const columns = datasetDetails.Dataset_column.map(
      (column): TableColumnProps => {
        return {
          name: column.name,
          id: column.id,
          field: getColumnFieldFromName(column.name),
          type: guardStringEnum(ENUM_Column_type, column.type),
        };
      },
    );

    // Map the rows and modify the content if the column is ground truth
    const rows = fileContentObject.rows.map((row, rowIndex) => {
      const updatedRow: DatasetRow = Object.fromEntries(
        Object.entries(row).map(([key, value], index) => {
          const header = key ? getColumnFieldFromName(key) : `column_${index}`;
          return [header, value];
        }),
      );

      datasetDetails.Dataset_column.forEach((column) => {
        if (column.type === ENUM_Column_type.GROUND_TRUTH) {
          const field = getColumnFieldFromName(column.name);
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
      datasetName: datasetDetails.file_name,
      ...convertToAGGridData({
        datasetId,
        columns,
        rows,
      }),
    };
  } catch (error) {
    console.error(error);
    // TODO: move the try-catch block around individual statements that can throw and handle the error there
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
