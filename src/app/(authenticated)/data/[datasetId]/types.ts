import { GridOptions } from 'ag-grid-community';

export type AGGridDataset<TData> = {
  columndDefs: GridOptions['columnDefs'];
  rowData: GridOptions<TData>['rowData'];
};
