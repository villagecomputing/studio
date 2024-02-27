import FileUpload from '@/lib/services/FileHandler';

import ApiUtils from '@/lib/services/ApiUtils';
import DatasetParser from '@/lib/services/DatasetParser';
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
    const dataToSend = uploadDatasetPayloadSchema.parse(
      JSON.parse(requestDatasetData),
    );

    if (!(await ApiUtils.isFilenameAvailable(dataToSend.datasetTitle))) {
      return response('Filename already exists', 400);
    }

    // Save file handles the saving method based on env
    const saveFileResult = await FileUpload.saveFile(
      file,
      dataToSend.datasetTitle,
    );
    if (!saveFileResult) {
      return response('File upload failed', 500);
    }

    const fileContent = await FileUpload.getFile(saveFileResult.filePath);

    if (!fileContent) {
      return response('File content is missing', 500);
    }

    const parsedFile = await DatasetParser.parseAsArray(fileContent);
    const groundTruthColumnContent = DatasetParser.getColumnFromArrayFormatData(
      parsedFile.rows,
      dataToSend.groundTruthColumnIndex,
    );

    ApiUtils.saveDatasetDetails({
      columnHeaders: parsedFile['headers'],
      groundTruthColumnContent,
      fileTitle: dataToSend.datasetTitle,
      groundTruthColumnIndex: dataToSend.groundTruthColumnIndex,
      totalNumberOfRows: parsedFile.rows.length,
      ...saveFileResult,
    });

    return response('OK');
  } catch (error) {
    console.error('Error in POST:', error);
    return response('Error processing request', 500);
  }
}
