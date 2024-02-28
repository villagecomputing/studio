import { ENUM_Column_type } from '@/lib/types';

import { exhaustiveCheck } from '@/lib/typeUtils';
import { ColDef } from 'ag-grid-community';
import { SparkleIcon, TagIcon } from 'lucide-react';
import CustomHeaderComponent from './components/CustomHeaderComponent';
import {
  AGGridDataset,
  ConvertToAGGridDataProps,
  DatasetRow,
  TableColumnProps,
} from './types';

export function getColumnFieldFromName(columnName: string): string {
  return columnName.replaceAll(' ', '_').toLowerCase();
}

export function getTableColumnIcon(columnType: ENUM_Column_type) {
  switch (columnType) {
    case ENUM_Column_type.GROUND_TRUTH:
      return <SparkleIcon size={14} />;
    case ENUM_Column_type.PREDICTIVE_LABEL:
      return <TagIcon size={14} />;
    case ENUM_Column_type.INPUT:
      return null;
    default: {
      return exhaustiveCheck(columnType);
    }
  }
}
function getTableColumnDefs(tableColumns: TableColumnProps[]): ColDef[] {
  return tableColumns.map((tableColumn) => ({
    field: tableColumn.field,
    headerName: tableColumn.name,
    headerComponent: CustomHeaderComponent,
    colId: tableColumn.id.toString(),
    type: tableColumn.type,
  }));
}

const getEmptyRow = (colHeaders: TableColumnProps[]) => {
  const emptyRow: DatasetRow = {};
  colHeaders.forEach((column) => {
    emptyRow[column.field] = '';
  });
  return emptyRow;
};

export function convertToAGGridData(
  data: ConvertToAGGridDataProps,
): AGGridDataset {
  return {
    columnDefs: getTableColumnDefs(data.columns),
    rowData: data.rows,
    pinnedBottomRowData: [getEmptyRow(data.columns)],
  };
}
