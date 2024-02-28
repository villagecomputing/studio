import { uploadDatasetPayloadSchema } from '@/app/api/dataset/upload/schema';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { ApiEndpoints } from '@/lib/routes/routes';

import { TOAST_MESSAGE } from '@/lib/language/toasts';
import { cn, getFilenameWithoutExtension } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { isFilenameAvailable } from '../../../actions';
import { useUploadDataContext } from '../UploadDataProvider';
import { UploadDataSchema } from '../constants';
import { UploadDataDialogContentProps, UploadDataSchemaValues } from '../types';
import { DatasetGroundTruthColumnSelector } from './DatasetGroundTruthColumnSelector';
import { DatasetTitleInput } from './DatasetTitleInput';

export default function UploadDataDialogContent(
  props: UploadDataDialogContentProps,
) {
  const { onCancel } = props;
  const { toast } = useToast();
  const { selectedFile, refetchData } = useUploadDataContext();
  const uploadDataForm = useForm<z.infer<typeof UploadDataSchema>>({
    resolver: zodResolver(UploadDataSchema),
    defaultValues: {
      [UploadDataSchemaValues.DATASET_TITLE]: getFilenameWithoutExtension(
        selectedFile?.name || '',
      ),
      [UploadDataSchemaValues.GROUND_TRUTH_COLUMN_INDEX]: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof UploadDataSchema>) {
    if (!selectedFile) {
      return;
    }
    if (
      values.datasetTitle.trim() &&
      !(await isFilenameAvailable(values.datasetTitle))
    ) {
      uploadDataForm.reset(values);
      uploadDataForm.setError('datasetTitle', {
        message:
          'This title is already used in another dataset, please enter a new one.',
      });
      return true;
    }

    const dataToSend = {
      datasetTitle: values.datasetTitle,
      groundTruthColumnIndex: values.groundTruthColumnIndex,
    };

    if (!uploadDatasetPayloadSchema.safeParse(dataToSend)) {
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('datasetData', JSON.stringify(dataToSend));

    const response = await fetch(ApiEndpoints.datasetUpload, {
      method: 'POST',
      body: formData,
    });
    if (response.status !== 200) {
      toast({
        title: 'Error',
        description: TOAST_MESSAGE.UPLOAD_DATASET_FAILED,
        variant: 'destructive',
      });
      return;
    }
    onCancel();
    refetchData();
  }

  return (
    <Form {...uploadDataForm}>
      <form
        onSubmit={uploadDataForm.handleSubmit(onSubmit)}
        className="mt-4 flex flex-1 flex-col gap-8 overflow-y-auto"
      >
        <DatasetTitleInput />
        <DatasetGroundTruthColumnSelector />
        <div className={cn(['flex items-center justify-end gap-3'])}>
          <Button variant={'outline'} onClick={onCancel}>
            Discard
          </Button>
          <Button
            type="submit"
            disabled={
              uploadDataForm.formState.isSubmitting ||
              !uploadDataForm.formState.isValid
            }
          >
            Upload
          </Button>
        </div>
      </form>
    </Form>
  );
}
