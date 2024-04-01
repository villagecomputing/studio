import { createSwaggerSpec } from 'next-swagger-doc';
import swaggerDocument from './next-swagger-doc.json';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec(swaggerDocument);
  return spec;
};
