import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { ColDef, GridOptions } from 'ag-grid-community';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';

export type DatasetViewPageProps = {
  params: {
    datasetId: string;
  };
};

export type AGGridDataset = {
  datasetId: string;
  columnDefs: ColDef[];
  rowData: DatasetRow[];
  pinnedBottomRowData: GridOptions['pinnedBottomRowData'];
};

export type DatasetTableColumnProps = {
  id: number;
  name: string;
  field: string;
  type: ENUM_Column_type;
};

export type ConvertToAGGridDataProps = {
  datasetId: string;
  columns: DatasetTableColumnProps[];
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
  tableViewMode: DatasetTableViewModeEnum;
  groundTruthColumnField: string | undefined;
  inspectorRowIndex: number | null;
  rows: AGGridDataset['rowData'];
  columnDefs: AGGridDataset['columnDefs'];
  pinnedBottomRow: AGGridDataset['pinnedBottomRowData'];
  gridRef: MutableRefObject<AgGridReactType<DatasetRow> | undefined>;
  setInspectorRowIndex: Dispatch<SetStateAction<number | null>>;
  updateGroundTruthCell: (props: UpdateGroundTruthCellParams) => void;
  toggleViewMode: () => void;
  updateRows: (rows: DatasetRow[]) => void;
  approveAll: () => Promise<void>;
};

export enum DatasetTableViewModeEnum {
  EDIT = 'EDIT',
  PREVIEW = 'PREVIEW',
}
