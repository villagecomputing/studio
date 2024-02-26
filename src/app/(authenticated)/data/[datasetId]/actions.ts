'use server';
import DatasetParser from '@/lib/services/DatasetParser';
import FileHandler from '@/lib/services/FileHandler';

import { permanentRedirect } from 'next/navigation';
import { AGGridDataset } from './types';
import { convertToAGGridData } from './utils';

export const fetchDataSet = async (
  datasetId: number,
): Promise<AGGridDataset<unknown> | null> => {
  if (!datasetId) {
    permanentRedirect('/data');
  }

  const fileContent = await FileHandler.getFile('/public/uploads/big_test.csv');
  if (!fileContent) {
    return null;
  }
  const fileContentObject = await DatasetParser.parseAsObject(fileContent);

  // TODO take the parsedFileContent and map the data to it

  return convertToAGGridData(fileContentObject) as AGGridDataset<unknown>;
};
