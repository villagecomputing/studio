'use server';
import DatasetParser, { ObjectParseResult } from '@/lib/services/DatasetParser';
import FileHandler from '@/lib/services/FileHandler';

import ApiUtils from '@/lib/services/ApiUtils';
import { guardStringEnum } from '@/lib/typeUtils';
import { ENUM_Column_type } from '@/lib/types';
import { permanentRedirect } from 'next/navigation';
import { FetchDatasetResult, TableColumnProps } from './types';
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
          field: getColumnFieldFromName(column.name),
          type: guardStringEnum(ENUM_Column_type, column.type),
        };
      },
    );

    // Map the rows and modify the content if the column is ground truth
    const rows: ObjectParseResult['rows'] = fileContentObject.rows.map(
      (row, rowIndex) => {
        const updatedRow = Object.fromEntries(
          Object.entries(row).map(([key, value]) => [
            getColumnFieldFromName(key),
            value,
          ]),
        );

        datasetDetails.Dataset_column.forEach((column) => {
          if (column.type === ENUM_Column_type.GROUND_TRUTH) {
            const field = getColumnFieldFromName(column.name);
            const groundTruthCell = column.Ground_truth_cell[rowIndex];
            updatedRow[field] = groundTruthCell.content;
          }
        });

        return updatedRow;
      },
    );

    return {
      datasetName: datasetDetails.file_name,
      ...convertToAGGridData({
        columns,
        rows,
      }),
    };
  } catch (error) {
    console.error(error);
    permanentRedirect('/data');
  }
};
