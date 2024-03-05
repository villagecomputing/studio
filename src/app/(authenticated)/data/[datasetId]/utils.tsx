import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';

import { exhaustiveCheck } from '@/lib/typeUtils';
import {
  CellClassParams,
  CellValueChangedEvent,
  ColDef,
  GetRowIdParams,
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
  return columnName.replaceAll('.', '_').replaceAll(' ', '_').toLowerCase();
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
    width: tableColumn.type === ENUM_Column_type.INPUT ? 200 : 250,
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
        if (event.node.isRowPinned()) {
          return;
        }
        event.context.setInspectorRowIndex(event.rowIndex);
      },
    },
    [ENUM_Column_type.PREDICTIVE_LABEL]: {
      editable: false,
      pinned: 'right',
      headerComponentParams: {
        leftSideIcon: getTableColumnIcon(ENUM_Column_type.PREDICTIVE_LABEL),
      } as HeaderComponentParams,
      onCellClicked(event) {
        if (event.node.isRowPinned()) {
          return;
        }
        event.context.setInspectorRowIndex(event.rowIndex);
      },
      cellRendererSelector: (params) => {
        if (params.node.isRowPinned() && params.node.rowPinned === 'bottom') {
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
      onCellClicked(event) {
        if (event.node.isRowPinned()) {
          return;
        }

        const context: DatasetTableContext = event.context;
        context.tableViewMode === DatasetTableViewModeEnum.PREVIEW &&
          context.setInspectorRowIndex(event.rowIndex);
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
  if (event.rowIndex === null) {
    throw new Error('RowIndex is missing');
  }
  if (
    event.oldValue?.content === event.newValue?.content &&
    event.oldValue?.status === event.newValue?.status
  ) {
    // nothing to update
    return;
  }
  (
    event.context
      .updateGroundTruthCell as DatasetTableContext['updateGroundTruthCell']
  )({
    rowIndex: event.rowIndex,
    content: event.newValue.content,
    status: event.newValue.status,
  });
};

export function isGroundTruthCell(
  value: DatasetRow[string],
): value is GroundTruthCell {
  return (
    typeof value === 'object' &&
    value !== null &&
    'content' in value &&
    'status' in value &&
    'id' in value &&
    Object.values(ENUM_Ground_truth_status).includes(
      value.status as ENUM_Ground_truth_status,
    )
  );
}

export const getRowId = (
  params: GetRowIdParams<unknown, DatasetTableContext>,
) => {
  const groundTruthCol = params.context.groundTruthColumnField;
  if (!groundTruthCol) {
    throw new Error('Ground truth column is missing');
  }
  const groundTruthCell = (params.data as DatasetRow)[groundTruthCol];
  if (!isGroundTruthCell(groundTruthCell)) {
    throw new Error('Ground truth cell is missing');
  }
  return groundTruthCell.id.toString();
};
