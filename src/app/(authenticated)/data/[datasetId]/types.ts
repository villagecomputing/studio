import { ENUM_Column_type } from '@/lib/types';
import { GridOptions } from 'ag-grid-community';

export type AGGridDataset<TData> = {
  columnDefs: GridOptions['columnDefs'];
  rowData: GridOptions<TData>['rowData'];
};

export type TableColumnProps = {
  name: string;
  type: ENUM_Column_type;
};
