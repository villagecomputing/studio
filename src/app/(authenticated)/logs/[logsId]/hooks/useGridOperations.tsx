import { ROW_ID_FIELD_NAME } from '@/app/(authenticated)/data/utils/commonUtils';
import RowMetadataCellRenderer from '@/app/(authenticated)/experiment/[experimentId]/components/RowMetadataCellRenderer';
import { ARROW_DOWN, ARROW_UP } from '@/lib/constants';
import { Enum_Dynamic_logs_static_fields } from '@/lib/services/ApiUtils/logs/utils';
import { Enum_Logs_Column_Type } from '@/lib/types';
import {
  CellClickedEvent,
  GetRowIdParams,
  GridOptions,
  NavigateToNextCellParams,
} from 'ag-grid-community';
import { formatDate } from 'date-fns';
import { useCallback } from 'react';
import CheckboxHeaderCellRenderer from '../components/CheckboxHeaderCellRenderer';
import { LogsRow, LogsTableContext } from '../types';

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
        cellClass: (params) => {
          const accuracy = Number(params.data.accuracy);
          if (isNaN(accuracy)) {
            return '';
          }
          return accuracy === 1 ? 'bg-agGroundMatch' : 'bg-agWrongLabelColor';
        },
      },
      [Enum_Logs_Column_Type.INPUT]: {
        editable: false,
        onCellClicked: (event) =>
          handleCellClicked(event, event.context.setInspectorRowIndex),
      },
      [Enum_Logs_Column_Type.CHECKBOX_SELECTION]: {
        editable: true,
        pinned: 'left',
        cellEditor: 'agCheckboxCellEditor',
        onCellValueChanged: (params) => {
          const context = params.context as LogsTableContext;
          context.setRowIdsToCopyToDataset(
            context.rows
              .filter(
                (row) =>
                  row[Enum_Dynamic_logs_static_fields.DATASET_ROW_ID] == null &&
                  row[Enum_Dynamic_logs_static_fields.CHECKBOX_SELECTION] ===
                    true,
              )
              .map((row) => String(row.id)),
          );
        },
        tooltipValueGetter: (props) =>
          props.data[Enum_Dynamic_logs_static_fields.DATASET_ROW_ID] != null
            ? `Row already added to dataset`
            : undefined,
        headerComponent: CheckboxHeaderCellRenderer,
        cellRendererSelector: (params) => {
          if (
            params.data[Enum_Dynamic_logs_static_fields.DATASET_ROW_ID] != null
          ) {
            return {
              component: 'agCheckboxCellRenderer',
              params: { disabled: true },
            };
          }
          return {
            component: 'agCheckboxCellRenderer',
            params: { disabled: false },
          };
        },
      },
      [Enum_Logs_Column_Type.TIMESTAMP]: {
        editable: false,
        valueGetter: (params) => {
          return new Date(
            params.data[Enum_Dynamic_logs_static_fields.CREATED_AT],
          );
        },
        valueFormatter: (params) => {
          return formatDate(params.value, "HH:mm s's' MM/dd/yyyy");
        },
        onCellClicked: (event) =>
          handleCellClicked(event, event.context.setInspectorRowIndex),
      },
    };
  }, []);

  return {
    getRowId,
    navigateToNextCell,
    columnTypes: getColumnTypes(),
  };
}
