export enum ENUM_Column_type {
  GROUND_TRUTH = 'GROUND_TRUTH',
  GROUND_TRUTH_STATUS = 'GROUND_TRUTH_STATUS',
  IDENTIFIER = 'IDENTIFIER',
  INPUT = 'INPUT',
  METADATA = 'METADATA',
  TIMESTAMP = 'TIMESTAMP',
}

export enum Enum_Experiment_Column_Type {
  IDENTIFIER = 'IDENTIFIER',
  OUTPUT = 'OUTPUT',
  INTERMEDIARY_OUTPUT = 'INTERMEDIARY_OUTPUT',
  /** Step metadata */
  STEP_METADATA = 'STEP_METADATA',
  /** Aggregated metadata from all individual steps. */
  METADATA = 'METADATA',
  /** For FE use only: Type of 'Metadata' column */
  ROW_METADATA = 'ROW_METADATA',
}

export enum Enum_Logs_Column_Type {
  IDENTIFIER = 'IDENTIFIER',
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  INTERMEDIARY_OUTPUT = 'INTERMEDIARY_OUTPUT',
  /** Step metadata */
  STEP_METADATA = 'STEP_METADATA',
  /** Aggregated metadata from all individual steps. */
  METADATA = 'METADATA',
  /** For FE use only: Type of 'Metadata' column */
  ROW_METADATA = 'ROW_METADATA',
  /** For FE use only: Type of the column with checkboxes for rows selection */
  CHECKBOX_SELECTION = 'CHECKBOX_SELECTION',
  TIMESTAMP = 'TIMESTAMP',
}

export enum ENUM_Data_type {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
}

export enum ENUM_Ground_truth_status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export enum ENUM_User_action {
  DATASET_UPLOADED = 'DATASET_UPLOADED',
  DATASET_DOWNLOADED = 'DATASET_DOWNLOADED',
  COLUMN_MARKED = 'COLUMN_MARKED',
  ROW_MARKED = 'ROW_MARKED',
  DATASET_RENAMED = 'DATASET_RENAMED',
  DATASET_DELETED = 'DATASET_DELETED',
  COLUMN_DELETED = 'COLUMN_DELETED',
}
