import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUploadDataContext } from '../UploadDataProvider';
import { UploadDataSchema } from '../constants';
import { UploadDataDialogContentProps, UploadDataSchemaValues } from '../types';
import { DatasetGroundTruthColumnSelector } from './DatasetGroundTruthColumnSelector';
import { DatasetTitleInput } from './DatasetTitleInput';

export default function UploadDataDialogContent(
  props: UploadDataDialogContentProps,
) {
  const { onCancel } = props;
  const { selectedFile } = useUploadDataContext();
  const uploadDataForm = useForm<z.infer<typeof UploadDataSchema>>({
    resolver: zodResolver(UploadDataSchema),
    defaultValues: {
      [UploadDataSchemaValues.DATASET_TITLE]: selectedFile?.name,
      [UploadDataSchemaValues.GROUND_TRUTH_COLUMN_INDEX]: -1,
    },
  });

  function onSubmit(values: z.infer<typeof UploadDataSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...uploadDataForm}>
      <form
        onSubmit={uploadDataForm.handleSubmit(onSubmit)}
        className="mt-4 flex flex-col gap-8"
      >
        <DatasetTitleInput />
        <DatasetGroundTruthColumnSelector />
        <div className={cn(['flex items-center justify-end gap-3'])}>
          <Button variant={'outline'} onClick={onCancel}>
            Discard
          </Button>
          <Button type="submit">Upload</Button>
        </div>
      </form>
    </Form>
  );
}
