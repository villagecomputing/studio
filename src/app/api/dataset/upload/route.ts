import { MAX_SQL_VARIABLES } from '@/lib/constants';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import ApiUtils from '@/lib/services/ApiUtils';
import { withAuthMiddleware } from '@/lib/services/ApiUtils/user/withAuthMiddleware';
import DatasetParser from '@/lib/services/DatasetParser';
import FileHandler from '@/lib/services/FileHandler';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { createFakeId } from '@/lib/utils';
import { response } from '../../utils';
import { newDatasetPayloadSchema } from '../new/schema';
import { uploadDatasetPayloadSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'UploadDataset',
});

/**
 * @swagger
 * /api/dataset/upload:
 *   post:
 *     tags:
 *      - Dataset
 *     summary: Uploads a dataset file and its associated data
 *     description: Uploads a dataset file and its associated data
 *     operationId: UploadDataset
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       description: Dataset file and data to be uploaded
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UploadDatasetPayload'
 *     responses:
 *       200:
 *         description: The newly uploaded dataset Id
 *       400:
 *         description: Missing required data -or- Invalid request headers type -or- Invalid request dataset type -or- Column Title required for blank ground truth column
 *       500:
 *         description: File content is missing -or- Error processing request
 */
export async function POST(request: Request) {
  return withAuthMiddleware(request, async (userId) => {
    const startTime = performance.now();

    if (!request.headers.get('Content-Type')?.includes('multipart/form-data')) {
      logger.warn('Invalid request headers');
      return response('Invalid request headers type', 400);
    }

    try {
      const formData = await request.formData();
      const file = formData.get('file');
      const requestDatasetData = formData.get('datasetData');

      if (!file || !requestDatasetData) {
        logger.warn('Missing required data');
        return response('Missing required data', 400);
      }
      if (typeof requestDatasetData !== 'string') {
        logger.warn('Invalid request dataset');
        return response('Invalid request dataset type', 400);
      }

      // Validates 'datasetData' against the schema
      const dataToSend = uploadDatasetPayloadSchema.parse(
        JSON.parse(requestDatasetData),
      );

      // Attempts to read the file content
      const fileContent = await FileHandler.readFileAsStream(file);
      if (!fileContent) {
        logger.error('File content is missing');
        return response('File content is missing', 500);
      }

      // Converts file content to a structured format
      const parsedFile = await DatasetParser.parseAsObject(fileContent);

      // Handles the addition of a new blank column for ground truth data
      const gtColumnIndex = dataToSend.groundTruthColumnIndex;
      const newGTColumnTitle = dataToSend.blankColumnTitle?.trim();
      let groundTruths = [
        parsedFile.headers[dataToSend.groundTruthColumnIndex],
      ];
      if (gtColumnIndex >= parsedFile['headers'].length) {
        if (!newGTColumnTitle) {
          logger.warn(
            'Column Title required for blank ground truth column in POST',
          );
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
      const datasetId = await ApiUtils.newDataset(dataset, userId);
      logger.debug('Created a new dataset', {
        id: datasetId,
        dataset,
      });

      const columnsPerRow = parsedFile.headers.length;
      const batchSize = Math.floor(MAX_SQL_VARIABLES / columnsPerRow);

      for (let i = 0; i < parsedFile.rows.length; i += batchSize) {
        const batch = parsedFile.rows.slice(i, i + batchSize);
        await ApiUtils.addData({ datasetId, payload: { datasetRows: batch } });
      }
      logger.debug('Populated dataset', {
        id: datasetId,
        rows: parsedFile.rows,
      });

      logger.info('Dataset uploaded successfully', {
        datasetId,
        elapsedTimeMs: performance.now() - startTime,
      });
      return Response.json({
        datasetId: createFakeId(dataset.datasetName, datasetId),
      });
    } catch (error) {
      logger.error('Error uploading dataset', error);
      return response('Error processing request', 500);
    }
  });
}
