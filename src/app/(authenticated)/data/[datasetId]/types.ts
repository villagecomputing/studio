import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Dispatch, SetStateAction } from 'react';

export type DatasetViewPageProps = {
  params: {
    datasetId: number;
  };
};

export type AGGridDataset = {
  columnDefs: ColDef[];
  rowData: DatasetRow[];
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
  status: ENUM_Ground_truth_status;
};

export type DatasetRow = {
  [k: string]: string | GroundTruthCell;
};

export type FetchDatasetResult = AGGridDataset & {
  datasetName: string;
};

export type UpdateGroundTruthCellParams = Partial<
  Pick<GroundTruthCell, 'content' | 'status'>
> & { rowIndex: number };

export type DatasetTableContext = {
  updateGroundTruthCell: (props: UpdateGroundTruthCellParams) => void;
  getNumberOfApprovedGT: () => number;
  toggleViewMode: () => void;
  calculateMatchPercentage: (predictiveLabel: string) => string | undefined;
  tableViewMode: DatasetTableViewModeEnum;
  groundTruthColumnField: string | undefined;
  setInspectorRowIndex: Dispatch<SetStateAction<number | null>>;
  inspectorRowIndex: number | null;
  rows: AGGridDataset['rowData'];
  columnDefs: AGGridDataset['columnDefs'];
  updateCol: (colId: number, colDef: ColDef) => void;
};

export enum DatasetTableViewModeEnum {
  EDIT = 'EDIT',
  PREVIEW = 'PREVIEW',
}
