import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { UploadDataFormContext, UploadDataSchemaValues } from '../types';
import DatasetColumnsList from './DatasetColumnsList';

export const DatasetGroundTruthColumnSelector = () => {
  const { control } = useFormContext<UploadDataFormContext>();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <FormField
      control={control}
      name={UploadDataSchemaValues.GROUND_TRUTH_COLUMN_INDEX}
      render={({ field }) => (
        <div>
          <FormLabel>Select ground truth column</FormLabel>
          <FormDescription>
            This column can contain pre-labels (your first pass at ground
            truth). You’ll have the chance to edit and approve the data.
          </FormDescription>
          <FormItem className="space-y-0">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-4 rounded-b-none"
              disabled={control._formState.isSubmitting}
            />
            <DatasetColumnsList
              field={field}
              searchTerm={searchTerm}
              disabled={control._formState.isSubmitting}
            />
          </FormItem>
        </div>
      )}
    />
  );
};
