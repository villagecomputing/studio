import FileUpload from '@/lib/services/FileUpload';
import { PrismaClient } from '@prisma/client';
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

    const parsedData = uploadDatasetPayloadSchema.parse(
      JSON.parse(requestDatasetData),
    );

    const dataToSend = parsedData;
    const saveFileResult = await FileUpload.saveFile(
      file,
      dataToSend.datasetTitle,
    );

    if (!saveFileResult) {
      return response('File upload failed', 500);
    }
    const prismaClient = new PrismaClient();

    const datasetInsertResult = await prismaClient.dataset.create({
      data: {
        file_location: `./public/uploads/${dataToSend.datasetTitle}.csv`,
        file_name: dataToSend.datasetTitle,
        file_size: saveFileResult?.fileSize,
        total_rows: dataToSend.totalNumberOfRows,
        file_type: saveFileResult.fileType,

        Dataset_column: {
          create: dataToSend.columnHeaders.map((header) => {
            return {
              name: header.name,
              index: header.index,
              dataType: 'string',
              type: 'test',
              //   Ground_truth_cell: {
              //     create: constdata.groundTruthColumnContent.map((cell) => {
              //       return {
              //         index: 2,
              //       };
              //     }),
              //   },
            };
          }),
        },
      },
    });
    console.log('🚀 ~ POST ~ datasetInsertResult:', datasetInsertResult);
    return response('Upload successful');
  } catch (error) {
    console.error('Error in POST:', error);
    return response('Error processing request', 500);
  }
}
