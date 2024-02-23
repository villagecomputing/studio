import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { UploadDataFormContext, UploadDataSchemaValues } from '../types';

export const DatasetTitleInput = () => {
  const { control } = useFormContext<UploadDataFormContext>();

  return (
    <FormField
      control={control}
      name={UploadDataSchemaValues.DATASET_TITLE}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Dataset Title</FormLabel>
          <FormControl>
            <Input {...field} disabled={control._formState.isSubmitting} />
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
