import { ENUM_Column_type, Enum_Experiment_Column_Type } from './types';

export const MAX_FILE_SIZE_MB = 100;
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_SQL_VARIABLES = 999;
export const ARROW_UP = 'ArrowUp';
export const ARROW_DOWN = 'ArrowDown';
export const ESCAPE = 'Escape';
export const ENTER = 'Enter';
export const DISPLAYABLE_DATASET_COLUMN_TYPES = [
  ENUM_Column_type.GROUND_TRUTH,
  ENUM_Column_type.INPUT,
  ENUM_Column_type.PREDICTIVE_LABEL,
];
export const UPDATABLE_EXPERIMENT_COLUMN_TYPES = [
  Enum_Experiment_Column_Type.METADATA,
  Enum_Experiment_Column_Type.OUTPUT,
];
