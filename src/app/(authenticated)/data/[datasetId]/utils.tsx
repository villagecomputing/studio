import { ObjectParseResult } from '@/lib/services/DatasetParser';
import { ENUM_Column_type } from '@/lib/types';
import { exhaustiveCheck } from '@/lib/utils';
import { GridOptions } from 'ag-grid-community';
import { SparkleIcon, TagIcon } from 'lucide-react';
import CustomHeaderComponent, {
  HeaderComponentParams,
} from './components/CustomHeaderComponent';
import { AGGridDataset, TableColumnProps } from './types';

// function getColumnFieldFromName(columnName: string): string {
//   return columnName.replace(' ', '_').toLowerCase();
// }

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
    // TODO use this instead after also changing the keys in the rows
    // field: getColumnFieldFromName(tableColumn.name),
    field: tableColumn.name,
    headerName: tableColumn.name,
    headerComponent: CustomHeaderComponent,
    headerComponentParams: {
      leftSideIcon: getTableColumnIcon(tableColumn.type),
    } as HeaderComponentParams,
  }));
}

export function convertToAGGridData(
  data: ObjectParseResult,
): AGGridDataset<unknown> {
  const tempColHeaders: TableColumnProps[] = data.headers.map((header) => ({
    name: header,
    type: ENUM_Column_type.INPUT,
  }));
  return {
    columnDefs: getTableColumnDefs(tempColHeaders),
    rowData: data.rows,
  };
}
