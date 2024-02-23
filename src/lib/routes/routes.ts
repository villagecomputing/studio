import { uploadDatasetPayloadSchema } from '@/app/api/dataset/upload/schema';
import { emptyObjectSchema } from '@/app/api/schema';
import { z } from 'zod';

type RouteObject = {
  payloadSchema: z.AnyZodObject;
  resultSchema: z.AnyZodObject;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
};

export enum ApiEndpoints {
  datasetUpload = '/api/dataset/upload',
}

export const ROUTES: Record<ApiEndpoints, RouteObject> = {
  [ApiEndpoints.datasetUpload]: {
    payloadSchema: uploadDatasetPayloadSchema,
    resultSchema: emptyObjectSchema,
    method: 'POST',
  },
};

export type PayloadSchemaType = {
  [ApiEndpoints.datasetUpload]: z.infer<typeof uploadDatasetPayloadSchema>;
};
