import { ROW_ID_FIELD_NAME } from '@/app/(authenticated)/data/utils/commonUtils';
import { Enum_Dynamic_logs_static_fields } from '@/lib/services/ApiUtils/logs/utils';
import { Enum_Logs_Column_Type } from '@/lib/types';
import { ColDef } from 'ag-grid-community';
import {
  AGGridLogs,
  ConvertToAGGridDataProps,
  LogsRow,
  LogsTableColumnProps,
} from '../../[logsId]/types';

function getTableColumnDefs(tableColumns: LogsTableColumnProps[]): ColDef[] {
  const columns = tableColumns.map((tableColumn): ColDef => {
    let minWidth: number | undefined;
    let maxWidth: number | undefined;
    if (tableColumn.type === Enum_Logs_Column_Type.ROW_METADATA) {
      minWidth = 210;
    }
    if (tableColumn.type === Enum_Logs_Column_Type.CHECKBOX_SELECTION) {
      minWidth = 55;
      maxWidth = 55;
    }
    return {
      field: tableColumn.field,
      headerName: tableColumn.name,
      colId: tableColumn.id.toString(),
      type: tableColumn.type,
      minWidth,
      maxWidth,
    };
  });
  return columns;
}

function getTableRows(rows: LogsRow[]): LogsRow[] {
  return rows.map((row, index) => ({
    ...row,
    metadata: '',
    [Enum_Dynamic_logs_static_fields.CHECKBOX_SELECTION]:
      row[Enum_Dynamic_logs_static_fields.DATASET_ROW_ID] != null,

    [ROW_ID_FIELD_NAME]: index.toString(),
  }));
}

export function convertToAGGridData(
  data: ConvertToAGGridDataProps,
): AGGridLogs {
  return {
    logsId: data.logsId,
    columnDefs: getTableColumnDefs(data.columns),
    rowData: getTableRows(data.rows),
  };
}
