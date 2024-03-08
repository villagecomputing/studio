// TODO: may need to expand to include labelkit specific columns common for all datasets
type DatasetRow = {
  columnName: string;
  columnValue: string;
  columnType?: string;
}[];

type Dataset = {
  organizationId: number;
  datasetIdentifier: string;
  datasetRows: DatasetRow[];
};

export async function saveDatasetDetailsAsTable(_dataset: Dataset) {
  // TODO: implement
  throw new Error('Not implemented');
}
