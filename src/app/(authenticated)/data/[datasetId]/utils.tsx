import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';

import { exhaustiveCheck } from '@/lib/typeUtils';
import {
  CellClassParams,
  CellValueChangedEvent,
  ColDef,
  GridOptions,
  SortDirection,
  ValueParserParams,
} from 'ag-grid-community';
import { ArrowDownIcon, ArrowUpIcon, SparkleIcon, TagIcon } from 'lucide-react';
import CustomHeaderComponent, {
  HeaderComponentParams,
} from './components/CustomHeaderComponent';
import GroundTruthCellRenderer from './components/GroundTruthCellRenderer';
import PredictiveLabelCellRenderer from './components/PredictiveLabelCellRenderer';
import {
  AGGridDataset,
  ConvertToAGGridDataProps,
  DatasetRow,
  DatasetTableContext,
  DatasetTableViewModeEnum,
  GroundTruthCell,
  TableColumnProps,
} from './types';

export function getColumnFieldFromName(columnName: string): string {
  return columnName.replaceAll(' ', '_').toLowerCase();
}

export function getTableColumnSortIcon(sort: SortDirection) {
  switch (sort) {
    case 'asc':
      return <ArrowDownIcon size={14} />;
    case 'desc':
      return <ArrowUpIcon size={14} />;
    case null:
      return null;
    default: {
      return exhaustiveCheck(sort);
    }
  }
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
    minWidth:
      tableColumn.type === ENUM_Column_type.GROUND_TRUTH ? 230 : undefined,
  }));
}

function getEmptyRow(colHeaders: TableColumnProps[]) {
  const emptyRow: DatasetRow = {};
  colHeaders.forEach((column) => {
    emptyRow[column.field] = '';
  });
  return emptyRow;
}

export function getTableColumnTypes(): GridOptions['columnTypes'] {
  return {
    [ENUM_Column_type.INPUT]: {
      editable: false,
      onCellClicked(event) {
        event.context.setInspectorRowIndex(event.rowIndex);
      },
    },
    [ENUM_Column_type.PREDICTIVE_LABEL]: {
      editable: false,
      headerComponentParams: {
        leftSideIcon: getTableColumnIcon(ENUM_Column_type.PREDICTIVE_LABEL),
      } as HeaderComponentParams,
      onCellClicked(event) {
        event.context.setInspectorRowIndex(event.rowIndex);
      },
      cellRendererSelector: (params) => {
        const context: DatasetTableContext = params.context;
        if (
          context.tableViewMode !== DatasetTableViewModeEnum.EDIT &&
          params.node.isRowPinned() &&
          params.node.rowPinned === 'bottom'
        ) {
          return { component: PredictiveLabelCellRenderer };
        }
      },
      cellClass: (params: CellClassParams) => {
        const label: string = params.value;
        const context: DatasetTableContext = params.context;
        if (
          !context.groundTruthColumnField ||
          context.tableViewMode === DatasetTableViewModeEnum.EDIT
        ) {
          return '';
        }
        const groundTruthCell: GroundTruthCell | undefined =
          params.data[context.groundTruthColumnField];

        if (
          !groundTruthCell ||
          groundTruthCell.status === ENUM_Ground_truth_status.PENDING
        ) {
          return '';
        }

        const matchesGroundTruth = label === groundTruthCell.content;

        return matchesGroundTruth
          ? 'predictiveLabelCell match'
          : 'predictiveLabelCell noMatch';
      },
    },
    [ENUM_Column_type.GROUND_TRUTH]: {
      editable: (params) => {
        return !(
          params.context.tableViewMode === DatasetTableViewModeEnum.PREVIEW ||
          (params.node.isRowPinned() && params.node.rowPinned === 'bottom')
        );
      },
      pinned: 'right',
      headerComponentParams: {
        leftSideIcon: getTableColumnIcon(ENUM_Column_type.GROUND_TRUTH),
      } as HeaderComponentParams,
      // TODO: Maybe use cellRendererSelector to have separate cell renderer for the pinned bottom row?
      cellRenderer: GroundTruthCellRenderer,
      cellClass: (params: CellClassParams<unknown, GroundTruthCell>) => {
        const context: DatasetTableContext = params.context;
        if (
          !params.value ||
          context.tableViewMode === DatasetTableViewModeEnum.EDIT
        ) {
          return '';
        }
        if (params.value.status === ENUM_Ground_truth_status.APPROVED) {
          return 'groundTruthCell approved';
        }
        return '';
      },
    },
  };
}

export function getTableDataTypeDefinitions(): GridOptions['dataTypeDefinitions'] {
  return {
    groundTruth: {
      baseDataType: 'object',
      extendsDataType: 'object',
      valueParser: (params) => {
        return {
          content: params.newValue,
          id: (params as ValueParserParams).oldValue?.id,
          status: ENUM_Ground_truth_status.APPROVED,
        };
      },
      valueFormatter: (params) => {
        return params.value.content;
      },
      dataTypeMatcher: (value) =>
        value && !!value.content && !!value.id && !!value.status,
    },
  };
}

export function convertToAGGridData(
  data: ConvertToAGGridDataProps,
): AGGridDataset {
  return {
    columnDefs: getTableColumnDefs(data.columns),
    rowData: data.rows,
    pinnedBottomRowData: [getEmptyRow(data.columns)],
  };
}

export const onTableCellValueChanged = (
  event: CellValueChangedEvent<unknown, GroundTruthCell>,
) => {
  if (event.colDef.type !== ENUM_Column_type.GROUND_TRUTH) {
    throw new Error('Editing other columns than GT!');
  }
  if (!event.value || !event.newValue) {
    throw new Error('Cell data is missing');
  }
  if (
    event.oldValue?.content === event.newValue?.content &&
    event.oldValue?.status === event.newValue?.status
  ) {
    // nothing to update
    return;
  }
  if (event.oldValue?.status !== event.newValue?.status) {
    // refresh to update the pinned bottom cell content
    event.api.refreshCells({
      columns: [event.column],
      force: true,
    });
  }
  event.context.updateGroundTruthCell(
    event.value?.id,
    event.newValue.content,
    event.newValue.status,
  );
};
