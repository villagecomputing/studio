import {
  ROW_ID_FIELD_NAME,
  isGroundTruthCell,
} from '@/app/(authenticated)/data/utils/commonUtils';
import { ARROW_DOWN, ARROW_UP } from '@/lib/constants';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import {
  CellClickedEvent,
  GetRowIdParams,
  GridOptions,
  NavigateToNextCellParams,
} from 'ag-grid-community';
import { useCallback } from 'react';
import RowMetadataCellRenderer from '../components/RowMetadataCellRenderer';
import { ExperimentRow, ExperimentTableContext } from '../types';

export function useGridOperations() {
  const navigateToNextCell = useCallback(
    (
      params: NavigateToNextCellParams<ExperimentRow, ExperimentTableContext>,
    ) => {
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
    (params: GetRowIdParams<ExperimentRow, ExperimentTableContext>): string => {
      const idValue = params.data[ROW_ID_FIELD_NAME];
      if (isGroundTruthCell(idValue)) {
        throw new Error('Wow! Somehow the ROW_ID is a groundTruthCell!');
      }
      return idValue;
    },
    [],
  );

  const getColumnTypes = useCallback((): GridOptions['columnTypes'] => {
    const handleCellClicked = (
      event: CellClickedEvent<ExperimentRow, unknown>,
      setRowIndex: ExperimentTableContext['setInspectorRowIndex'],
    ) => {
      setRowIndex(event.rowIndex);
    };

    return {
      [Enum_Experiment_Column_Type.ROW_METADATA]: {
        editable: false,
        onCellClicked: (event) =>
          handleCellClicked(event, event.context.setInspectorRowIndex),
        cellRenderer: RowMetadataCellRenderer,
      },
      [Enum_Experiment_Column_Type.OUTPUT]: {
        editable: false,
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
