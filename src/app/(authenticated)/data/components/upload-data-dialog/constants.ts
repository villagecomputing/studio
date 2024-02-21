import { z } from 'zod';
import { UploadDataSchemaValues } from './types';

export const UploadDataSchema = z.object({
  [UploadDataSchemaValues.DATASET_TITLE]: z
    .string()
    .min(1, {
      message:
        'Please provide a title for the dataset, the field cannot be left empty.',
    })
    .max(50, { message: 'The title cannot be longer than 50 characters.' }),
  [UploadDataSchemaValues.GROUND_TRUTH_COLUMN_INDEX]: z
    .number()
    .min(0, 'Select one column'),
});
