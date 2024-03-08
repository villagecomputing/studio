import { exhaustiveCheck } from '@/lib/typeUtils';
import { ENUM_Column_type } from '@/lib/types';
import {
  CellClassParams,
  ColDef,
  EditableCallbackParams,
  IRowNode,
  SortDirection,
} from 'ag-grid-community';
import { ArrowDownIcon, ArrowUpIcon, SparkleIcon, TagIcon } from 'lucide-react';
import CustomHeaderComponent from '../components/CustomHeaderComponent';
import {
  AGGridDataset,
  ConvertToAGGridDataProps,
  DatasetRow,
  DatasetTableViewModeEnum,
  GroundTruthCell,
  TableColumnProps,
} from '../types';
import { ROW_ID_FIELD_NAME, isGroundTruthCell } from './commonUtils';

function getTableColumnDefs(tableColumns: TableColumnProps[]): ColDef[] {
  return tableColumns.map((tableColumn) => ({
    field: tableColumn.field,
    headerName: tableColumn.name,
    headerComponent: CustomHeaderComponent,
    colId: tableColumn.id.toString(),
    type: tableColumn.type,
    width: tableColumn.type === ENUM_Column_type.GROUND_TRUTH ? 230 : 200,
  }));
}

function getTableRows(rows: DatasetRow[]): DatasetRow[] {
  return rows.map((row, index) => ({
    ...row,
    [ROW_ID_FIELD_NAME]: index.toString(),
  }));
}

function getEmptyRow(colHeaders: TableColumnProps[]) {
  const emptyRow: DatasetRow = {};
  colHeaders.forEach((column) => {
    emptyRow[column.field] = '';
  });
  return emptyRow;
}

function predictiveLabelCellClass(
  params: CellClassParams<DatasetRow, unknown>,
) {
  if (
    !params.context.groundTruthColumnField ||
    params.node.isRowPinned() ||
    !params.data
  ) {
    return '';
  }

  const groundTruthCell = params.data[params.context.groundTruthColumnField];
  if (!isGroundTruthCell(groundTruthCell)) {
    return '';
  }
  const matchesGroundTruth =
    groundTruthCell && params.value === groundTruthCell.content;

  return matchesGroundTruth
    ? 'predictiveLabelCell match'
    : 'predictiveLabelCell noMatch';
}

function isEditableGroundTruth(
  params: EditableCallbackParams<DatasetRow, unknown>,
) {
  return !(
    params.context.tableViewMode === DatasetTableViewModeEnum.PREVIEW ||
    (params.node.isRowPinned() && params.node.rowPinned === 'bottom')
  );
}

function getTableColumnSortIcon(sort: SortDirection) {
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
function predictiveLabelComparator(
  valueA: string,
  valueB: string,
  nodeA: IRowNode<DatasetRow>,
  nodeB: IRowNode<DatasetRow>,
) {
  const nodeAData = nodeA.data;
  const nodeBData = nodeB.data;
  if (!nodeAData || !nodeBData) {
    return 0;
  }
  const groundTruthField = Object.keys(nodeAData).find((key) =>
    isGroundTruthCell(nodeAData[key]),
  );
  if (!groundTruthField) {
    return 0;
  }

  const groundTruthA = nodeAData[groundTruthField] as GroundTruthCell;
  const groundTruthB = nodeBData[groundTruthField] as GroundTruthCell;
  if (!groundTruthA || !groundTruthB) {
    return 0;
  }

  const nodeAValue = valueA === groundTruthA.content ? 1 : 0;
  const nodeBValue = valueB === groundTruthB.content ? 1 : 0;
  return nodeAValue - nodeBValue;
}

function convertToAGGridData(data: ConvertToAGGridDataProps): AGGridDataset {
  return {
    datasetId: data.datasetId,
    columnDefs: getTableColumnDefs(data.columns),
    rowData: getTableRows(data.rows),
    pinnedBottomRowData: [getEmptyRow(data.columns)],
  };
}

export {
  convertToAGGridData,
  getTableColumnIcon,
  getTableColumnSortIcon,
  isEditableGroundTruth,
  predictiveLabelCellClass,
  predictiveLabelComparator,
};
