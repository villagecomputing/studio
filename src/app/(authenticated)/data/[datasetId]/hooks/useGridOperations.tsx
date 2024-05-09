import { ARROW_DOWN, ARROW_UP } from '@/lib/constants';
import { Enum_Dynamic_dataset_static_fields } from '@/lib/services/ApiUtils/dataset/utils';
import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import {
  CellClickedEvent,
  CellValueChangedEvent,
  GetRowIdParams,
  GridOptions,
  NavigateToNextCellParams,
  ValueParserParams,
} from 'ag-grid-community';
import { formatDate } from 'date-fns';
import { useCallback } from 'react';
import DatasetGrid from '../../utils/DatasetGrid';
import { ROW_ID_FIELD_NAME, isGroundTruthCell } from '../../utils/commonUtils';
import CustomHeaderComponent, {
  HeaderComponentParams,
} from '../components/CustomHeaderComponent';
import GroundTruthCellRenderer from '../components/GroundTruthCellRenderer';
import { DatasetRow, DatasetTableContext, GroundTruthCell } from '../types';

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

  const getColumnTypes = useCallback((): GridOptions['columnTypes'] => {
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
      [ENUM_Column_type.GROUND_TRUTH]: {
        editable: DatasetGrid.isEditableGroundTruth,
        pinned: 'right',
        headerComponent: CustomHeaderComponent,
        headerComponentParams: {
          leftSideIcon: DatasetGrid.getTableColumnIcon(
            ENUM_Column_type.GROUND_TRUTH,
          ),
        } as HeaderComponentParams,
        cellRenderer: GroundTruthCellRenderer,
        onCellClicked: (event) =>
          handleCellClicked(event, event.context.setInspectorRowIndex),
      },
      [ENUM_Column_type.TIMESTAMP]: {
        editable: false,
        valueGetter: (params) => {
          const createdAtParam =
            params.data[Enum_Dynamic_dataset_static_fields.CREATED_AT];
          return createdAtParam && !isNaN(Date.parse(createdAtParam))
            ? new Date(createdAtParam)
            : createdAtParam;
        },
        valueFormatter: (params) => {
          return params.value
            ? formatDate(params.value, "HH:mm s's' MM/dd/yyyy")
            : params.value;
        },
        onCellClicked: (event) =>
          handleCellClicked(event, event.context.setInspectorRowIndex),
      },
    };
  }, []);

  const getDataTypeDefinitions =
    useCallback((): GridOptions['dataTypeDefinitions'] => {
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
          dataTypeMatcher: (value) => value && isGroundTruthCell(value),
        },
      };
    }, []);

  return {
    getRowId,
    navigateToNextCell,
    onCellValueChanged,
    columnTypes: getColumnTypes(),
    dataTypeDefinitions: getDataTypeDefinitions(),
  };
}
