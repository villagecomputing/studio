import { approveAll } from './dataset/approveAll';
import { editDatasetColumn } from './dataset/editDatasetColumn';
import { editGroundTruthCell } from './dataset/editGroundTruthCell';
import { getDataset } from './dataset/getDataset';
import { isFilenameAvailable, saveDatasetDetails } from './dataset/upload';
import { saveDatasetDetailsAsTable } from './dataset/uploadToDb';

export default {
  getDataset,
  editDatasetColumn,
  editGroundTruthCell,
  saveDatasetDetails,
  isFilenameAvailable,
  saveDatasetDetailsAsTable,
  approveAll,
};
