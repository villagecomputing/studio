import { ControllerRenderProps } from 'react-hook-form';
import { z } from 'zod';
import { UploadDataSchema } from './constants';

export enum UploadDataSchemaValues {
  DATASET_TITLE = 'datasetTitle',
  GROUND_TRUTH_COLUMN_INDEX = 'groundTruthColumnIndex',
}

export type UploadDataFormContext = z.infer<typeof UploadDataSchema>;

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
  blankGroundTruthColumnAdded: boolean;
  // TODO Add extra data for upload here
  onFileSelected: (file: File | null) => void;
  addBlankGroundTruthColumn: () => void;
};
