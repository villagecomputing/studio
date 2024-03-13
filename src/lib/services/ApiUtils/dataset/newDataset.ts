import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';

// TODO: may need to expand to include labelkit specific columns common for all datasets
export async function newDataset(
  _dataset: PayloadSchemaType[ApiEndpoints.datasetNew],
) {
  // TODO: implement + parse
  throw new Error('Not implemented');
}
