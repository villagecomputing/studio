import { datasetViewResponseSchema } from '@/app/api/dataset/[datasetId]/schema';
import { approveAllSchema } from '@/app/api/dataset/edit/approveAll/schema';
import { editGroundTruthCellSchema } from '@/app/api/dataset/edit/cell/schema';
import { editDatasetColumnSchema } from '@/app/api/dataset/edit/column/schema';
import { datasetListResponseSchema } from '@/app/api/dataset/list/schema';
import { uploadDatasetAsTablePayloadSchema } from '@/app/api/dataset/upload-as-table/schema';
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
  datasetUploadAsTable = '/api/dataset/upload-as-table',
  datasetList = '/api/dataset/list',
  datasetView = '/api/dataset',
  datasetColumnEdit = '/api/dataset/edit/column',
  groundTruthCellEdit = '/api/dataset/edit/cell',
  datasetApproveAll = 'api/dataset/edit/approveAll',
}

export const ROUTES: Record<ApiEndpoints, RouteObject> = {
  [ApiEndpoints.datasetUpload]: {
    payloadSchema: uploadDatasetPayloadSchema,
    resultSchema: emptyObjectSchema,
    method: 'POST',
  },
  [ApiEndpoints.datasetUploadAsTable]: {
    payloadSchema: uploadDatasetAsTablePayloadSchema,
    resultSchema: emptyObjectSchema,
    method: 'POST',
  },
  [ApiEndpoints.datasetColumnEdit]: {
    payloadSchema: editDatasetColumnSchema,
    resultSchema: emptyObjectSchema,
    method: 'POST',
  },
  [ApiEndpoints.groundTruthCellEdit]: {
    payloadSchema: editGroundTruthCellSchema,
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
  [ApiEndpoints.datasetUploadAsTable]: z.infer<
    typeof uploadDatasetAsTablePayloadSchema
  >;
  [ApiEndpoints.datasetColumnEdit]: z.infer<typeof editDatasetColumnSchema>;
  [ApiEndpoints.groundTruthCellEdit]: z.infer<typeof editGroundTruthCellSchema>;
  [ApiEndpoints.datasetApproveAll]: z.infer<typeof approveAllSchema>;
};

export type ResultSchemaType = {
  [ApiEndpoints.datasetList]: z.infer<typeof datasetListResponseSchema>;
  [ApiEndpoints.datasetView]: z.infer<typeof datasetViewResponseSchema>;
};
