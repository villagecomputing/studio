import { MAX_FILE_SIZE_MB } from '../constants';

export enum TOAST_MESSAGE {
  FILE_SIZE_ERROR = `File size cannot exceed ${MAX_FILE_SIZE_MB} MB`,
  UPLOAD_DATASET_FAILED = `Failed to upload the dataset`,
}
