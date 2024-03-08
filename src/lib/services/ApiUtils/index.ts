import {
  approveAll,
  editDatasetCell,
  editDatasetColumn,
  getDataset,
} from './dataset';

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
