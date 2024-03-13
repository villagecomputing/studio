import { approveAll, editDatasetCell, editDatasetColumn } from './dataset';
import { addData } from './dataset/addData';

import { getDataset } from './dataset/getDataset';
import { newDataset } from './dataset/newDataset';

import { isFilenameAvailable, saveDatasetDetails } from './dataset/upload';

export default {
  getDataset,
  editDatasetColumn,
  newDataset,
  addData,
  editDatasetCell,
  saveDatasetDetails,
  isFilenameAvailable,
  approveAll,
};
