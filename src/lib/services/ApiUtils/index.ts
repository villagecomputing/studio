import { editDatasetCell, editDatasetColumn, getDataset } from './dataset';

import { isFilenameAvailable, saveDatasetDetails } from './dataset/upload';

export default {
  getDataset,
  editDatasetColumn,
  editDatasetCell,
  saveDatasetDetails,
  isFilenameAvailable,
};
