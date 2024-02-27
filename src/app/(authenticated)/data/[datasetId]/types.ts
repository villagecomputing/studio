import { ObjectParseResult } from '@/lib/services/DatasetParser';
import { ENUM_Column_type } from '@/lib/types';
import { GridOptions } from 'ag-grid-community';

export type DatasetViewPageProps = {
  params: {
    datasetId: number;
  };
};

export type AGGridDataset = {
  columnDefs: GridOptions['columnDefs'];
  rowData: GridOptions['rowData'];
};

export type TableColumnProps = {
  id: number;
  name: string;
  field: string;
  type: ENUM_Column_type;
};

export type ConvertToAGGridDataProps = {
  columns: TableColumnProps[];
  rows: ObjectParseResult['rows'];
};

export type FetchDatasetResult = AGGridDataset & {
  datasetName: string;
};

export type DatasetTableContext = AGGridDataset & {
  refreshData: () => void;
};
