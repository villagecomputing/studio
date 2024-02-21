import { Button } from '@/components/ui/button';
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useUploadDataContext } from '../UploadDataProvider';
import { UploadDataFormContext, UploadDataSchemaValues } from '../types';
import DatasetColumnsList from './DatasetColumnsList';

export const DatasetGroundTruthColumnSelector = () => {
  const { control } = useFormContext<UploadDataFormContext>();
  const { addBlankGroundTruthColumn, blankGroundTruthColumnAdded } =
    useUploadDataContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [shouldShowBlankGroundTruthError, setShouldShowBlankGroundTruthError] =
    useState(false);

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
            />
            <DatasetColumnsList field={field} searchTerm={searchTerm} />
          </FormItem>
          <Button
            type="button"
            variant="secondary"
            className="my-4 w-full"
            onClick={() => {
              if (blankGroundTruthColumnAdded) {
                setShouldShowBlankGroundTruthError(true);
                return;
              }
              addBlankGroundTruthColumn();
            }}
          >
            <PlusIcon size={16} className="mr-2" /> Blank ground truth column
          </Button>
          {shouldShowBlankGroundTruthError && (
            <FormDescription className="text-destructive">
              {"You've already created a blank ground truth column"}
            </FormDescription>
          )}
        </div>
      )}
    />
  );
};
