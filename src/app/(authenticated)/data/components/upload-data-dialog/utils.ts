import { z } from 'zod';
import { UploadDataSchemaValues } from './types';

export const UploadDataSchema = (blankGTColumnIndex: number) =>
  z
    .object({
      [UploadDataSchemaValues.DATASET_TITLE]: z
        .string()
        .min(1, {
          message:
            'Please provide a title for the dataset, the field cannot be left empty.',
        })
        .max(50, { message: 'The title cannot be longer than 50 characters.' }),
      [UploadDataSchemaValues.GROUND_TRUTH_COLUMN_INDEX]: z
        .string()
        .min(0, 'Select one column'),
      [UploadDataSchemaValues.BLANK_GT_COLUMN_TITLE]: z.string().optional(),
    })
    .refine(
      (data) => {
        if (
          Number(data[UploadDataSchemaValues.GROUND_TRUTH_COLUMN_INDEX]) ===
          blankGTColumnIndex
        ) {
          return (
            data[UploadDataSchemaValues.BLANK_GT_COLUMN_TITLE] &&
            data[UploadDataSchemaValues.BLANK_GT_COLUMN_TITLE].trim().length > 0
          );
        }
        return true;
      },
      {
        message: 'Column title is required',
        path: [UploadDataSchemaValues.BLANK_GT_COLUMN_TITLE],
      },
    );
