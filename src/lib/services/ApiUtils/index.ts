import { addData } from './dataset/addData';

import { newDataset } from './dataset/newDataset';

import { approveAll } from './dataset/approveAll';
import { editDatasetColumn } from './dataset/editDatasetColumn';
import { editGroundTruthCell } from './dataset/editGroundTruthCell';
import { getDataset } from './dataset/getDataset';
import { getExperiment } from './experiment/getExperiment';

export default {
  getDataset,
  editDatasetColumn,
  newDataset,
  addData,
  editGroundTruthCell,
  approveAll,
  getExperiment,
};
