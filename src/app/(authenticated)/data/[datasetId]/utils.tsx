import { ENUM_Column_type } from '@/lib/types';

import { exhaustiveCheck } from '@/lib/typeUtils';
import { GridOptions } from 'ag-grid-community';
import { SparkleIcon, TagIcon } from 'lucide-react';
import CustomHeaderComponent, {
  HeaderComponentParams,
} from './components/CustomHeaderComponent';
import {
  AGGridDataset,
  ConvertToAGGridDataProps,
  TableColumnProps,
} from './types';

export function getColumnFieldFromName(columnName: string): string {
  return columnName.replace(' ', '_').toLowerCase();
}

function getTableColumnIcon(columnType: ENUM_Column_type) {
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
function getTableColumnDefs(
  tableColumns: TableColumnProps[],
): GridOptions['columnDefs'] {
  return tableColumns.map((tableColumn) => ({
    field: tableColumn.field,
    headerName: tableColumn.name,
    headerComponent: CustomHeaderComponent,
    pinned: tableColumn.type === ENUM_Column_type.GROUND_TRUTH && 'right',
    headerComponentParams: {
      leftSideIcon: getTableColumnIcon(tableColumn.type),
    } as HeaderComponentParams,
  }));
}

export function convertToAGGridData(
  data: ConvertToAGGridDataProps,
): AGGridDataset<unknown> {
  return {
    columnDefs: getTableColumnDefs(data.columns),
    rowData: data.rows,
  };
}
