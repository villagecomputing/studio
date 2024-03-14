// Imports necessary modules and schemas
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import ApiUtils from '@/lib/services/ApiUtils';
import DatasetParser from '@/lib/services/DatasetParser';
import FileHandler from '@/lib/services/FileHandler';
import { response } from '../../utils';
import { newDatasetPayloadSchema } from '../new/schema';
import { uploadDatasetPayloadSchema } from './schema';

export async function POST(request: Request) {
  try {
    // Checks for the correct 'Content-Type' in request headers
    if (!request.headers.get('Content-Type')?.includes('multipart/form-data')) {
      return response('Invalid request headers type', 400);
    }

    // Retrieves FormData from the request
    const formData = await request.formData();
    const file = formData.get('file');
    const requestDatasetData = formData.get('datasetData');

    // Validates the presence of 'file' and 'datasetData' in the FormData
    if (!file || !requestDatasetData) {
      return response('Missing required data', 400);
    }

    // Ensures 'datasetData' is a string before parsing
    if (typeof requestDatasetData !== 'string') {
      return response('Invalid request dataset type', 400);
    }

    // Validates 'datasetData' against the schema
    const dataToSend = uploadDatasetPayloadSchema.parse(
      JSON.parse(requestDatasetData),
    );

    // Checks if the dataset name is already in use
    if (!(await ApiUtils.isDatasetNameAvailable(dataToSend.datasetTitle))) {
      return response('Dataset name already exists', 400);
    }

    // Attempts to read the file content
    const fileContent = await FileHandler.readFileAsStream(file);
    if (!fileContent) {
      return response('File content is missing', 500);
    }

    // Converts file content to a structured format
    const parsedFile = await DatasetParser.parseAsArray(fileContent);

    // Handles the addition of a new blank column for ground truth data
    const gtColumnIndex = dataToSend.groundTruthColumnIndex;
    const newGTColumnTitle = dataToSend.blankColumnTitle?.trim();
    let groundTruths = [parsedFile.headers[dataToSend.groundTruthColumnIndex]];
    if (gtColumnIndex >= parsedFile['headers'].length) {
      if (!newGTColumnTitle) {
        return response(
          'Column Title required for blank ground truth column',
          400,
        );
      }
      groundTruths = [newGTColumnTitle];
      parsedFile.rows.map((row) => ({ ...row, [newGTColumnTitle]: '' }));
    }

    // Prepares the dataset object for creation
    const dataset = newDatasetPayloadSchema.parse({
      datasetName: dataToSend.datasetTitle,
      columns: parsedFile.headers,
      groundTruths,
    } as PayloadSchemaType[ApiEndpoints.datasetNew]);

    // Creates a new dataset record
    const datasetId = await ApiUtils.newDataset(dataset);

    // Add data to the created dataset
    // TODO call ApiUtils.addData(datasetId, parsedFile.rows)

    return Response.json({ datasetId });
  } catch (error) {
    console.error('Error in POST:', error);
    return response('Error processing request', 500);
  }
}
