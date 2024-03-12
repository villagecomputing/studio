import { approveAll, editDatasetCell, editDatasetColumn } from './dataset';

import { getDataset } from './dataset/getDataset';

import { isFilenameAvailable, saveDatasetDetails } from './dataset/upload';
import { saveDatasetDetailsAsTable } from './dataset/uploadToDb';

export default {
  getDataset,
  editDatasetColumn,
  editDatasetCell,
  saveDatasetDetails,
  isFilenameAvailable,
  saveDatasetDetailsAsTable,
  approveAll,
};
