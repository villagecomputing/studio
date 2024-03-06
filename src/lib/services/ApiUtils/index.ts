import {
  approveAll,
  editDatasetCell,
  editDatasetColumn,
  getDatasetDetails,
} from './dataset';

import { isFilenameAvailable, saveDatasetDetails } from './dataset/upload';

export default {
  getDatasetDetails,
  editDatasetColumn,
  editDatasetCell,
  saveDatasetDetails,
  isFilenameAvailable,
  approveAll,
};
