import { ENUM_Column_type } from '@/lib/types';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Dispatch, SetStateAction } from 'react';

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
  updateGroundTruthCell: (
    rowId: number,
    content: string,
    status: string,
  ) => void;
  getNumberOfApprovedGT: () => number;
  toggleViewMode: () => void;
  calculateMatchPercentage: (predictiveLabel: string) => string | undefined;
  tableViewMode: DatasetTableViewModeEnum;
  groundTruthColumnField: string | undefined;
  setInspectorRowIndex: Dispatch<SetStateAction<number | null>>;
  inspectorRowIndex: number | null;
};

export enum DatasetTableViewModeEnum {
  EDIT = 'EDIT',
  PREVIEW = 'PREVIEW',
}
