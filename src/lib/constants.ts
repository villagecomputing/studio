import { ENUM_Column_type } from './types';

export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ARROW_UP = 'ArrowUp';
export const ARROW_DOWN = 'ArrowDown';
export const ESCAPE = 'Escape';
export const ENTER = 'Enter';
export const DISPLAYABLE_COLUMN_TYPES = [
  ENUM_Column_type.GROUND_TRUTH,
  ENUM_Column_type.INPUT,
  ENUM_Column_type.PREDICTIVE_LABEL,
];
