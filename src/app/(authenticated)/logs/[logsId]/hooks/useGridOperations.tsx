import { ROW_ID_FIELD_NAME } from '@/app/(authenticated)/data/utils/commonUtils';
import RowMetadataCellRenderer from '@/app/(authenticated)/experiment/[experimentId]/components/RowMetadataCellRenderer';
import { ARROW_DOWN, ARROW_UP } from '@/lib/constants';
import { Enum_Logs_Column_Type } from '@/lib/types';
import {
  CellClickedEvent,
  GetRowIdParams,
  GridOptions,
  IRowNode,
  NavigateToNextCellParams,
} from 'ag-grid-community';
import { formatDate, isAfter, isBefore, isEqual, startOfDay } from 'date-fns';
import { useCallback } from 'react';
import { DateRangeFilter, LogsRow, LogsTableContext } from '../types';

export function useGridOperations() {
  const navigateToNextCell = useCallback(
    (params: NavigateToNextCellParams<LogsRow, LogsTableContext>) => {
      const suggestedNextCell = params.nextCellPosition;

      const noUpOrDownKey =
        params.key !== ARROW_DOWN && params.key !== ARROW_UP;
      if (noUpOrDownKey) {
        return suggestedNextCell;
      }

      params.api.forEachNode((node) => {
        if (suggestedNextCell && node.rowIndex === suggestedNextCell.rowIndex) {
          node.setSelected(true);
        }
      });

      return suggestedNextCell;
    },
    [],
  );

  const getRowId = useCallback(
    (params: GetRowIdParams<LogsRow, LogsTableContext>): string => {
      return String(params.data[ROW_ID_FIELD_NAME]);
    },
    [],
  );

  const getColumnTypes = useCallback((): GridOptions['columnTypes'] => {
    const handleCellClicked = (
      event: CellClickedEvent<LogsRow, unknown>,
      setRowIndex: LogsTableContext['setInspectorRowIndex'],
    ) => {
      setRowIndex(event.rowIndex);
    };

    return {
      [Enum_Logs_Column_Type.ROW_METADATA]: {
        editable: false,
        onCellClicked: (event) =>
          handleCellClicked(event, event.context.setInspectorRowIndex),
        cellRenderer: RowMetadataCellRenderer,
      },
      [Enum_Logs_Column_Type.OUTPUT]: {
        editable: false,
        onCellClicked: (event) =>
          handleCellClicked(event, event.context.setInspectorRowIndex),
      },
      [Enum_Logs_Column_Type.INPUT]: {
        editable: false,
        onCellClicked: (event) =>
          handleCellClicked(event, event.context.setInspectorRowIndex),
      },
      [Enum_Logs_Column_Type.TIMESTAMP]: {
        editable: false,
        valueGetter: (params) => {
          return new Date(params.data['created_at']);
        },
        valueFormatter: (params) => {
          return formatDate(params.value, "HH:mm s's' MM/dd/yyyy");
        },
        onCellClicked: (event) =>
          handleCellClicked(event, event.context.setInspectorRowIndex),
      },
    };
  }, []);

  const isExternalFilterPresent = (dateRange: DateRangeFilter['dateRange']) => {
    return dateRange !== undefined;
  };
  const doesExternalFilterPass = (
    node: IRowNode<LogsRow>,
    dateRange: DateRangeFilter['dateRange'],
  ) => {
    if (!dateRange || !dateRange.from) {
      return true;
    }
    if (
      !node.data?.['created_at'] ||
      typeof node.data?.['created_at'] === 'boolean'
    ) {
      return false;
    }

    const createdAt = startOfDay(new Date(node.data['created_at']));
    if (
      isEqual(createdAt, dateRange.from) ||
      (!!dateRange.to &&
        isAfter(createdAt, dateRange.from) &&
        (isBefore(createdAt, dateRange.to) || isEqual(createdAt, dateRange.to)))
    ) {
      return true;
    }
    return false;
  };

  return {
    getRowId,
    navigateToNextCell,
    columnTypes: getColumnTypes(),
    isExternalFilterPresent,
    doesExternalFilterPass,
  };
}
