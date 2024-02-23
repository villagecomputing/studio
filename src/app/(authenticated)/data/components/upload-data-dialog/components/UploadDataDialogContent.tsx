import { uploadDatasetPayloadSchema } from '@/app/api/dataset/upload/schema';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { ApiEndpoints } from '@/lib/routes/routes';
import DatasetParser from '@/lib/services/DatasetParser';
import { cn, getFilenameWithoutExtension } from '@/lib/utils';
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
  const { toast } = useToast();
  const { selectedFile, columnHeaders } = useUploadDataContext();
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
    const parsedFile = await DatasetParser.parseAsArray(selectedFile);
    const groundTruthColumnContent = DatasetParser.getColumnFromArrayFormatData(
      parsedFile.rows,
      values.groundTruthColumnIndex,
    );

    const dataToSend = {
      datasetTitle: values.datasetTitle,
      columnHeaders,
      groundTruthColumnIndex: values.groundTruthColumnIndex,
      totalNumberOfRows: 10,
      groundTruthColumnContent,
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
    console.log('🚀 ~ onSubmit ~ response:', response);
    if (response.status !== 200) {
      toast({
        title: 'Error',
        description: 'Failed to upload the dataset',
        variant: 'destructive',
      });
      return;
    }
    onCancel();
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
