import { addDataPayloadSchema } from '@/app/api/dataset/[datasetId]/addData/schema';
import { datasetViewResponseSchema } from '@/app/api/dataset/[datasetId]/schema';
import { approveAllSchema } from '@/app/api/dataset/edit/approveAll/schema';
import { editDatasetCellSchema } from '@/app/api/dataset/edit/cell/schema';
import { editDatasetColumnSchema } from '@/app/api/dataset/edit/column/schema';
import { datasetListResponseSchema } from '@/app/api/dataset/list/schema';
import {
  newDatasetPayloadSchema,
  newDatasetResponseSchema,
} from '@/app/api/dataset/new/schema';
import { uploadDatasetPayloadSchema } from '@/app/api/dataset/upload/schema';
import { emptyObjectSchema } from '@/app/api/schema';
import { z } from 'zod';

type RouteObject = {
  payloadSchema: z.AnyZodObject | z.ZodEffects<z.AnyZodObject>;
  resultSchema: z.AnyZodObject | z.ZodArray<z.AnyZodObject>;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
};

export enum ApiEndpoints {
  datasetUpload = '/api/dataset/upload',
  datasetNew = '/api/dataset/new',
  datasetAddData = '/api/dataset/addData',
  datasetList = '/api/dataset/list',
  datasetView = '/api/dataset',
  datasetColumnEdit = '/api/dataset/edit/column',
  datasetCellEdit = '/api/dataset/edit/cell',
  datasetApproveAll = 'api/dataset/edit/approveAll',
}

export const ROUTES: Record<ApiEndpoints, RouteObject> = {
  [ApiEndpoints.datasetUpload]: {
    payloadSchema: uploadDatasetPayloadSchema,
    resultSchema: emptyObjectSchema,
    method: 'POST',
  },
  [ApiEndpoints.datasetNew]: {
    payloadSchema: newDatasetPayloadSchema,
    resultSchema: newDatasetResponseSchema,
    method: 'POST',
  },
  [ApiEndpoints.datasetAddData]: {
    payloadSchema: addDataPayloadSchema,
    resultSchema: emptyObjectSchema,
    method: 'POST',
  },
  [ApiEndpoints.datasetColumnEdit]: {
    payloadSchema: editDatasetColumnSchema,
    resultSchema: emptyObjectSchema,
    method: 'POST',
  },
  [ApiEndpoints.datasetCellEdit]: {
    payloadSchema: editDatasetCellSchema,
    resultSchema: emptyObjectSchema,
    method: 'POST',
  },
  [ApiEndpoints.datasetList]: {
    payloadSchema: emptyObjectSchema,
    resultSchema: datasetListResponseSchema,
    method: 'GET',
  },
  [ApiEndpoints.datasetView]: {
    payloadSchema: emptyObjectSchema,
    resultSchema: datasetViewResponseSchema,
    method: 'GET',
  },
  [ApiEndpoints.datasetApproveAll]: {
    payloadSchema: approveAllSchema,
    resultSchema: emptyObjectSchema,
    method: 'POST',
  },
};

export type PayloadSchemaType = {
  [ApiEndpoints.datasetUpload]: z.infer<typeof uploadDatasetPayloadSchema>;
  [ApiEndpoints.datasetNew]: z.infer<typeof newDatasetPayloadSchema>;
  [ApiEndpoints.datasetAddData]: z.infer<typeof addDataPayloadSchema>;
  [ApiEndpoints.datasetColumnEdit]: z.infer<typeof editDatasetColumnSchema>;
  [ApiEndpoints.datasetCellEdit]: z.infer<typeof editDatasetCellSchema>;
  [ApiEndpoints.datasetApproveAll]: z.infer<typeof approveAllSchema>;
};

export type ResultSchemaType = {
  [ApiEndpoints.datasetList]: z.infer<typeof datasetListResponseSchema>;
  [ApiEndpoints.datasetView]: z.infer<typeof datasetViewResponseSchema>;
};
