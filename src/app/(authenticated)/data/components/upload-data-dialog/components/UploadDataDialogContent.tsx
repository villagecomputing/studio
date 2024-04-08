import {
  uploadDatasetPayloadSchema,
  uploadDatasetResultSchema,
} from '@/app/api/dataset/upload/schema';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';

import { TOAST_MESSAGE } from '@/lib/language/toasts';
import {
  cn,
  getDatasetUuidFromFakeId,
  getFilenameWithoutExtension,
} from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useUploadDataContext } from '../UploadDataProvider';
import {
  UploadDataDialogContentProps,
  UploadDataFormContext,
  UploadDataSchemaValues,
} from '../types';
import { UploadDataSchema } from '../utils';
import { DatasetGroundTruthColumnSelector } from './DatasetGroundTruthColumnSelector';
import { DatasetTitleInput } from './DatasetTitleInput';

export default function UploadDataDialogContent(
  props: UploadDataDialogContentProps,
) {
  const { onCancel } = props;
  const { toast } = useToast();
  const router = useRouter();
  const { selectedFile, blankGTColumn, columnHeaders } = useUploadDataContext();
  const uploadDataForm = useForm<UploadDataFormContext>({
    resolver: zodResolver(UploadDataSchema(columnHeaders.length - 1)),
    reValidateMode: 'onChange',
    defaultValues: {
      [UploadDataSchemaValues.DATASET_TITLE]: getFilenameWithoutExtension(
        selectedFile?.name || '',
      ),
      [UploadDataSchemaValues.GROUND_TRUTH_COLUMN_INDEX]: '0',
      [UploadDataSchemaValues.BLANK_GT_COLUMN_TITLE]: '',
    },
  });

  async function onSubmit(values: UploadDataFormContext) {
    if (!selectedFile) {
      return;
    }

    const dataToSend: PayloadSchemaType[ApiEndpoints.datasetUpload] = {
      datasetTitle: values.datasetTitle,
      groundTruthColumnIndex: Number(values.groundTruthColumnIndex),
    };

    if (!uploadDatasetPayloadSchema.safeParse(dataToSend).success) {
      return;
    }

    if (Number(values.groundTruthColumnIndex) === blankGTColumn.index) {
      dataToSend['blankColumnTitle'] = blankGTColumn.name;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('datasetData', JSON.stringify(dataToSend));

    const response = await fetch(ApiEndpoints.datasetUpload, {
      method: 'POST',
      body: formData,
    });
    const responseBody = await response.json();
    const dataset = uploadDatasetResultSchema.parse(responseBody);
    const datasetId = getDatasetUuidFromFakeId(dataset.datasetId);

    if (response.status !== 200 || !datasetId) {
      toast({
        title: 'Error',
        description: TOAST_MESSAGE.UPLOAD_DATASET_FAILED,
        variant: 'destructive',
      });
      return;
    }
    onCancel();
    router.push(`/data/${datasetId}`);
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
            disabled={uploadDataForm.formState.isSubmitting}
          >
            Upload
          </Button>
        </div>
      </form>
    </Form>
  );
}
