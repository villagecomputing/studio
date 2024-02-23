import { Prisma } from '@/app/layout';
import FileUpload from '@/lib/services/FileUpload';
import {
  ENUM_Column_type,
  ENUM_Data_type,
  ENUM_Ground_truth_status,
} from '@/lib/types';
import { response } from '../../utils';
import { uploadDatasetPayloadSchema } from './schema';

export async function POST(request: Request) {
  try {
    if (!request.headers.get('Content-Type')?.includes('multipart/form-data')) {
      return response('Invalid request headers type', 400);
    }
    // Parse the FormData from the request
    const formData = await request.formData();
    const file = formData.get('file');
    const requestDatasetData = formData.get('datasetData');

    if (!file || !requestDatasetData) {
      return response('Missing required data', 400);
    }
    if (typeof requestDatasetData !== 'string') {
      return response('Invalid request dataset type', 400);
    }

    // Parse the dataset data object using the defined schema
    // This will throw if the object doesn't match the schema
    const parsedData = uploadDatasetPayloadSchema.parse(
      JSON.parse(requestDatasetData),
    );
    const dataToSend = parsedData;
    // Save file handles the saving method based on env
    const saveFileResult = await FileUpload.saveFile(
      file,
      dataToSend.datasetTitle,
    );

    if (!saveFileResult) {
      return response('File upload failed', 500);
    }
    // Save the dataset object in db

    const datasetColumns = dataToSend.columnHeaders.map((header, index) => {
      return {
        name: header.name,
        index: header.index,
        dataType: ENUM_Data_type.STRING,
        type:
          index === dataToSend.groundTruthColumnIndex
            ? ENUM_Column_type.GROUND_TRUTH
            : ENUM_Column_type.INPUT,
      };
    });
    const datasetResult = await Prisma.dataset.create({
      data: {
        file_location: `./public/uploads/${dataToSend.datasetTitle}.csv`,
        file_name: dataToSend.datasetTitle,
        file_size: saveFileResult?.fileSize,
        total_rows: dataToSend.totalNumberOfRows,
        file_type: saveFileResult.fileType,

        Dataset_column: {
          create: datasetColumns,
        },
      },
    });
    const groundTruthColumnId = await Prisma.dataset_column.findFirst({
      where: {
        dataset_id: { equals: datasetResult.id },
        type: { equals: ENUM_Column_type.GROUND_TRUTH },
      },
      select: {
        id: true,
      },
    });

    if (!groundTruthColumnId) {
      return response('Ground truth column was not found', 500);
    }

    // TODO this might be dangerous since we are creating many inserts but there is no createMany function in prisma when using sqlite
    const inserts = dataToSend.groundTruthColumnContent.map((cell) =>
      Prisma.ground_truth_cell.create({
        data: {
          content: cell,
          column_id: groundTruthColumnId.id,
          status: ENUM_Ground_truth_status.PENDING,
        },
      }),
    );
    await Prisma.$transaction(inserts);

    return response('Upload successful');
  } catch (error) {
    console.error('Error in POST:', error);
    return response('Error processing request', 500);
  }
}
