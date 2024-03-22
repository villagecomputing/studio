import { addData } from './dataset/addData';

import { newDataset } from './dataset/newDataset';

import { approveAll } from './dataset/approveAll';
import { editDatasetColumn } from './dataset/editDatasetColumn';
import { editGroundTruthCell } from './dataset/editGroundTruthCell';
import { getDataset } from './dataset/getDataset';
import { createExperimentTable } from './experiment/createExperimentTable';
import { getExperiment } from './experiment/getExperiment';
import { insertExperimentSteps } from './experiment/insertExperimentSteps';
import { updateExperiment } from './experiment/updateExperiment';

export default {
  getDataset,
  editDatasetColumn,
  newDataset,
  addData,
  editGroundTruthCell,
  approveAll,
  getExperiment,
  createExperimentTable,
  insertExperimentSteps,
  updateExperiment,
};
