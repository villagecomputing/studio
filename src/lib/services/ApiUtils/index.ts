import { addData } from './dataset/addData';

import { newDataset } from './dataset/newDataset';

import { approveAll } from './dataset/approveAll';
import { editDatasetColumn } from './dataset/editDatasetColumn';
import { editGroundTruthCell } from './dataset/editGroundTruthCell';
import { getDataset } from './dataset/getDataset';
import { isFilenameAvailable, saveDatasetDetails } from './dataset/upload';

export default {
  getDataset,
  editDatasetColumn,
  newDataset,
  addData,
  editGroundTruthCell,
  saveDatasetDetails,
  isFilenameAvailable,
  approveAll,
};
