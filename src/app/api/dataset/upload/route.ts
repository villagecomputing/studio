import { MAX_SQL_VARIABLES } from '@/lib/constants';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import ApiUtils from '@/lib/services/ApiUtils';
import DatasetParser from '@/lib/services/DatasetParser';
import FileHandler from '@/lib/services/FileHandler';
import { response } from '../../utils';
import { newDatasetPayloadSchema } from '../new/schema';
import { uploadDatasetPayloadSchema } from './schema';

/**
 * @swagger
 * /api/dataset/upload:
 *   post:
 *     tags:
 *      - Dataset
 *     summary: Uploads a dataset file and its associated data
 *     requestBody:
 *       description: Dataset file and data to be uploaded
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UploadDatasetPayload'
 *     responses:
 *       '200':
 *         description: The newly uploaded dataset Id
 *       '400':
 *         description: Missing required data -or- Invalid request headers type -or- Invalid request dataset type -or- Column Title required for blank ground truth column
 *       '500':
 *         description: File content is missing -or- Error processing request
 */
export async function POST(request: Request) {
  try {
    if (!request.headers.get('Content-Type')?.includes('multipart/form-data')) {
      return response('Invalid request headers type', 400);
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const requestDatasetData = formData.get('datasetData');

    if (!file || !requestDatasetData) {
      return response('Missing required data', 400);
    }
    if (typeof requestDatasetData !== 'string') {
      return response('Invalid request dataset type', 400);
    }

    // Validates 'datasetData' against the schema
    const dataToSend = uploadDatasetPayloadSchema.parse(
      JSON.parse(requestDatasetData),
    );

    // Attempts to read the file content
    const fileContent = await FileHandler.readFileAsStream(file);
    if (!fileContent) {
      return response('File content is missing', 500);
    }

    // Converts file content to a structured format
    const parsedFile = await DatasetParser.parseAsObject(fileContent);

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
      parsedFile.rows.map((row) => ({
        ...row,
        [newGTColumnTitle]: '',
      }));
    }

    // Prepares the dataset object for creation
    const dataset = newDatasetPayloadSchema.parse({
      datasetName: dataToSend.datasetTitle,
      columns: parsedFile.headers,
      groundTruths,
    } as PayloadSchemaType[ApiEndpoints.datasetNew]);

    // Creates a new dataset record
    const datasetId = await ApiUtils.newDataset(dataset);

    const columnsPerRow = parsedFile.headers.length;
    const batchSize = Math.floor(MAX_SQL_VARIABLES / columnsPerRow);

    for (let i = 0; i < parsedFile.rows.length; i += batchSize) {
      const batch = parsedFile.rows.slice(i, i + batchSize);
      await ApiUtils.addData({
        datasetId: datasetId,
        datasetRows: batch,
      });
    }

    return Response.json({ datasetId });
  } catch (error) {
    console.error('Error in POST:', error);
    return response('Error processing request', 500);
  }
}
