import { datasetViewResponseSchema } from '@/app/api/dataset/[datasetId]/schema';
import { editDatasetCellSchema } from '@/app/api/dataset/edit/cell/schema';
import { editDatasetColumnSchema } from '@/app/api/dataset/edit/column/schema';
import { datasetListResponseSchema } from '@/app/api/dataset/list/schema';
import { uploadDatasetPayloadSchema } from '@/app/api/dataset/upload/schema';
import { emptyObjectSchema } from '@/app/api/schema';
import { z } from 'zod';

type RouteObject = {
  payloadSchema: z.AnyZodObject;
  resultSchema: z.AnyZodObject | z.ZodArray<z.AnyZodObject>;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
};

export enum ApiEndpoints {
  datasetUpload = '/api/dataset/upload',
  datasetList = '/api/dataset/list',
  datasetView = '/api/dataset',
  datasetColumnEdit = '/api/dataset/edit/column',
  datasetCellEdit = '/api/dataset/edit/cell',
}

export const ROUTES: Record<ApiEndpoints, RouteObject> = {
  [ApiEndpoints.datasetUpload]: {
    payloadSchema: uploadDatasetPayloadSchema,
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
};

export type PayloadSchemaType = {
  [ApiEndpoints.datasetUpload]: z.infer<typeof uploadDatasetPayloadSchema>;
  [ApiEndpoints.datasetColumnEdit]: z.infer<typeof editDatasetColumnSchema>;
  [ApiEndpoints.datasetCellEdit]: z.infer<typeof editDatasetCellSchema>;
};

export type ResultSchemaType = {
  [ApiEndpoints.datasetList]: z.infer<typeof datasetListResponseSchema>;
  [ApiEndpoints.datasetView]: z.infer<typeof datasetViewResponseSchema>;
};
