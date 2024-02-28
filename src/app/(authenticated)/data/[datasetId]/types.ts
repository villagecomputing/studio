import { ENUM_Column_type } from '@/lib/types';
import { CheckedState } from '@radix-ui/react-checkbox';
import { ColDef, GridOptions } from 'ag-grid-community';

export type DatasetViewPageProps = {
  params: {
    datasetId: number;
  };
};

export type AGGridDataset = {
  columnDefs: ColDef[];
  rowData: GridOptions['rowData'];
  pinnedBottomRowData: GridOptions['pinnedBottomRowData'];
};

export type TableColumnProps = {
  id: number;
  name: string;
  field: string;
  type: ENUM_Column_type;
};

export type ConvertToAGGridDataProps = {
  columns: TableColumnProps[];
  rows: DatasetRow[];
};

export type GroundTruthCell = {
  content: string;
  id: number;
  status: string;
};

export type DatasetRow = {
  [k: string]: string | GroundTruthCell;
};

export type FetchDatasetResult = AGGridDataset & {
  datasetName: string;
};

export type DatasetTableContext = AGGridDataset & {
  refreshData: () => void;
  getTableViewMode: () => DatasetTableViewModeEnum;
  updateGroundTruthRowStatus: (rowId: number, checked: CheckedState) => void;
  getNumberOfApprovedGT: () => number;
};

export enum DatasetTableViewModeEnum {
  EDIT = 'EDIT',
  PREVIEW = 'PREVIEW',
}
