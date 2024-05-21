import { response } from '@/app/api/utils';
import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import ApiUtils from '@/lib/services/ApiUtils';
import { getDynamicTableContent } from '@/lib/services/ApiUtils/common/getDynamicTableContent';
import {
  API_SCHEMA_PROP_TO_DB_STATIC_FIELD_MAPPING,
  Enum_Dynamic_dataset_static_fields,
} from '@/lib/services/ApiUtils/dataset/utils';
import { withAuthMiddleware } from '@/lib/services/ApiUtils/user/withAuthMiddleware';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { UUIDPrefixEnum, getUuidFromFakeId } from '@/lib/utils';
import { addDataPayloadSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'AddDatasetData',
});

const filterOutExistingFingerprints = async (
  datasetId: string,
  datasetRows: PayloadSchemaType[ApiEndpoints.datasetAddData]['datasetRows'],
) => {
  const fingerprintField =
    API_SCHEMA_PROP_TO_DB_STATIC_FIELD_MAPPING[
      Enum_Dynamic_dataset_static_fields.ROW_ID
    ];
  const datasetFingerprints = await getDynamicTableContent({
    tableName: datasetId,
    selectFields: [fingerprintField],
  });

  const existingFingerprints = new Set(
    datasetFingerprints.map((row) => row[fingerprintField]),
  );
  const rowsToAdd = datasetRows.filter(
    (row) => !existingFingerprints.has(row.row_id),
  );

  if (rowsToAdd.length < datasetRows.length) {
    logger.warn(
      `Ignore existing row ids: ${datasetRows
        .filter((row) => existingFingerprints.has(row.row_id))
        .map((row) => row.row_id)}.`,
    );
  }

  return rowsToAdd;
};

/**
 * @swagger
 * /api/dataset/{datasetId}/addData:
 *   post:
 *     tags:
 *      - Dataset
 *     summary: Inserts data into a dataset.
 *     description: Inserts data into a dataset.
 *     operationId: AddDatasetData
 *     security:
 *      - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: datasetId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the dataset.
 *         example: Dataset_Name-d-4d71fa65-6e01-475b-a924-b078195f8498
 *     requestBody:
 *       description: Data to be added to the dataset
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddDataPayload'
 *     responses:
 *       200:
 *         description: Successfully added the dataset rows.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddDataResponse'
 *       400:
 *         description: Missing required data -or- Invalid request headers type
 *       500:
 *         description: Error processing request
 */
export async function POST(
  request: Request,
  { params }: { params: { datasetId: string } },
) {
  return withAuthMiddleware(request, async () => {
    const startTime = performance.now();
    const datasetId = params.datasetId;
    if (!datasetId) {
      logger.warn('Invalid dataset id provided');
      return response('Invalid dataset id', 400);
    }

    if (!request.headers.get('Content-Type')?.includes('application/json')) {
      logger.warn('Invalid request headers type');
      return response('Invalid request headers type', 400);
    }
    let requestBody: string | undefined;
    try {
      requestBody = await request.json();
      if (!requestBody) {
        logger.warn('Missing required data');
        return response('Missing required data', 400);
      }

      // Parse the dataset data object using the defined schema
      // This will throw if the object doesn't match the schema
      const dataset = addDataPayloadSchema.parse(requestBody);
      const datasetUuid = getUuidFromFakeId(datasetId, UUIDPrefixEnum.DATASET);
      const rowsToAdd = await filterOutExistingFingerprints(
        datasetUuid,
        dataset.datasetRows,
      );

      const res = await ApiUtils.addData({
        datasetId: datasetUuid,
        payload: { datasetRows: rowsToAdd },
      });

      logger.info('Data added to dataset successfully', {
        elapsedTimeMs: performance.now() - startTime,
        datasetId,
        rowsAdded: dataset.datasetRows.length,
      });
      return Response.json({ rowsAdded: res });
    } catch (error) {
      logger.error('Error adding dataset data', error, {
        datasetId,
        requestBody,
      });
      return response('Error processing request', 500);
    }
  });
}
