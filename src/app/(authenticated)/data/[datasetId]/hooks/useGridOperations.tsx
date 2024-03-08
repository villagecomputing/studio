import { ARROW_DOWN, ARROW_UP } from '@/lib/constants';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import {
  CellClickedEvent,
  CellValueChangedEvent,
  GetRowIdParams,
  GridOptions,
  NavigateToNextCellParams,
  ValueParserParams,
} from 'ag-grid-community';
import { useCallback, useMemo } from 'react';
import { HeaderComponentParams } from '../components/CustomHeaderComponent';
import GroundTruthCellRenderer from '../components/GroundTruthCellRenderer';
import PredictiveLabelCellRenderer from '../components/PredictiveLabelCellRenderer';
import { DatasetRow, DatasetTableContext, GroundTruthCell } from '../types';
import { ROW_ID_FIELD_NAME, isGroundTruthCell } from '../utils/commonUtils';
import {
  getTableColumnIcon,
  isEditableGroundTruth,
  predictiveLabelCellClass,
  predictiveLabelComparator,
} from '../utils/gridUtils';

export function useGridOperations() {
  const navigateToNextCell = useCallback(
    (params: NavigateToNextCellParams<DatasetRow, DatasetTableContext>) => {
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

  const onCellValueChanged = useCallback(
    (event: CellValueChangedEvent<DatasetRow, GroundTruthCell>) => {
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
    },
    [],
  );

  const getRowId = useCallback(
    (params: GetRowIdParams<DatasetRow, DatasetTableContext>): string => {
      const idValue = params.data[ROW_ID_FIELD_NAME];
      if (isGroundTruthCell(idValue)) {
        throw new Error('Wow! Somehow the ROW_ID is a groundTruthCell!');
      }
      return idValue;
    },
    [],
  );

  const columnTypes = useMemo((): GridOptions['columnTypes'] => {
    const handleCellClicked = (
      event: CellClickedEvent<DatasetRow, unknown>,
      setRowIndex: DatasetTableContext['setInspectorRowIndex'],
    ) => {
      if (!event.node.isRowPinned()) {
        setRowIndex(event.rowIndex);
      }
    };

    return {
      [ENUM_Column_type.INPUT]: {
        editable: false,
        onCellClicked: (event) =>
          handleCellClicked(event, event.context.setInspectorRowIndex),
      },
      [ENUM_Column_type.PREDICTIVE_LABEL]: {
        editable: false,
        pinned: 'right',
        headerComponentParams: {
          leftSideIcon: getTableColumnIcon(ENUM_Column_type.PREDICTIVE_LABEL),
        } as HeaderComponentParams,
        comparator: predictiveLabelComparator,
        onCellClicked: (event) =>
          handleCellClicked(event, event.context.setInspectorRowIndex),
        cellRendererSelector: (params) =>
          params.node.isRowPinned() && params.node.rowPinned === 'bottom'
            ? { component: PredictiveLabelCellRenderer }
            : undefined,
        cellClass: predictiveLabelCellClass,
      },
      [ENUM_Column_type.GROUND_TRUTH]: {
        editable: isEditableGroundTruth,
        pinned: 'right',
        headerComponentParams: {
          leftSideIcon: getTableColumnIcon(ENUM_Column_type.GROUND_TRUTH),
        } as HeaderComponentParams,
        cellRenderer: GroundTruthCellRenderer,
        onCellClicked: (event) =>
          handleCellClicked(event, event.context.setInspectorRowIndex),
      },
    };
  }, []);

  const dataTypeDefinitions =
    useMemo((): GridOptions['dataTypeDefinitions'] => {
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
    }, []);

  return {
    getRowId,
    navigateToNextCell,
    onCellValueChanged,
    columnTypes,
    dataTypeDefinitions,
  };
}
