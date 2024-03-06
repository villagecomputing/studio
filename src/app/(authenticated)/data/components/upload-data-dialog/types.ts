import { ControllerRenderProps } from 'react-hook-form';
import { z } from 'zod';
import { UploadDataSchema } from './utils';

export enum UploadDataSchemaValues {
  DATASET_TITLE = 'datasetTitle',
  GROUND_TRUTH_COLUMN_INDEX = 'groundTruthColumnIndex',
  BLANK_GT_COLUMN_TITLE = 'blankGTColumnTitle',
}

export type UploadDataFormContext = z.infer<
  ReturnType<typeof UploadDataSchema>
>;

export type DatasetColumnsListProps = {
  disabled: boolean;
  searchTerm: string;
  field: ControllerRenderProps<
    UploadDataFormContext,
    UploadDataSchemaValues.GROUND_TRUTH_COLUMN_INDEX
  >;
};

export type UploadDataDialogContentProps = {
  onCancel: () => void;
};

export type UploadDataDialogProps = {
  onCancel: () => void;
  open: boolean;
};

export type ColumnHeader = { index: number; name: string };

export type UploadDataContextType = {
  selectedFile: File | null;
  columnHeaders: ColumnHeader[];
  onFileSelected: (file: File | null) => Promise<void>;
  refetchData: () => Promise<void>;
  blankGTColumn: ColumnHeader;
  setBlankGTColumnName: (name: string) => void;
};
