import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { ColDef } from 'ag-grid-community';
import { AgGridReact as AgGridReactType } from 'ag-grid-react/lib/agGridReact';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { approveAll as approveAllGT, updateGTCell } from '../actions';
import {
  AGGridDataset,
  DatasetRow,
  DatasetTableContext,
  DatasetTableViewModeEnum,
  GroundTruthCell,
  UpdateGroundTruthCellParams,
} from '../types';
import { isGroundTruthCell } from '../utils/commonUtils';

export const useDatasetTableContext = (
  props: AGGridDataset,
): DatasetTableContext => {
  const router = useRouter();
  const datasetId = props.datasetId;
  const gridRef = useRef<AgGridReactType<DatasetRow>>();
  const [rows, setRows] = useState<AGGridDataset['rowData']>(props.rowData);
  const [columnDefs, setColumnDefs] = useState<AGGridDataset['columnDefs']>(
    props.columnDefs,
  );
  const [pinnedBottomRow, setPinnedBottomRow] = useState<
    AGGridDataset['pinnedBottomRowData']
  >(props.pinnedBottomRowData);
  const [tableViewMode, setTableViewMode] = useState<DatasetTableViewModeEnum>(
    DatasetTableViewModeEnum.PREVIEW,
  );
  const [inspectorRowIndex, setInspectorRowIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    updatePinnedBottomRow();
  }, [rows, columnDefs]);

  const groundTruthColumnField = useMemo(() => {
    return columnDefs.find(
      (colDef) => colDef.type === ENUM_Column_type.GROUND_TRUTH,
    )?.field;
  }, [columnDefs]);

  const getNumberOfApprovedGT = () => {
    return (
      rows.filter(
        (row) =>
          groundTruthColumnField &&
          (row[groundTruthColumnField] as GroundTruthCell)?.status ===
            ENUM_Ground_truth_status.APPROVED,
      )?.length ?? 0
    );
  };

  const updateGroundTruthCell = async (props: UpdateGroundTruthCellParams) => {
    const { content, rowIndex, status } = props;
    if (!groundTruthColumnField) {
      return;
    }
    const groundTruthCell = rows[rowIndex][groundTruthColumnField];
    if (!isGroundTruthCell(groundTruthCell)) {
      return;
    }
    const updateData: { content?: string; status?: ENUM_Ground_truth_status } =
      {};
    if (content) {
      updateData.content = content;
    }
    if (status) {
      updateData.status = status;
    }

    const newCellContent = {
      id: groundTruthCell.id,
      content: updateData.content || groundTruthCell.content,
      status: updateData.status || groundTruthCell.status,
    };
    updateRow(rowIndex, {
      [groundTruthColumnField]: newCellContent,
    });
    await updateGTCell(
      datasetId,
      groundTruthCell.id,
      updateData.content || groundTruthCell.content,
      updateData.status || groundTruthCell.status,
    );
  };

  const approveAll = async () => {
    if (!groundTruthColumnField) {
      return;
    }
    await approveAllGT(datasetId);
    const newRows = await Promise.all(
      rows.map(async (row) => {
        const groundTruthCell = row[groundTruthColumnField];
        if (
          !isGroundTruthCell(groundTruthCell) ||
          groundTruthCell.status === ENUM_Ground_truth_status.APPROVED
        ) {
          return row;
        }
        return {
          ...row,
          [groundTruthColumnField]: {
            ...groundTruthCell,
            status: ENUM_Ground_truth_status.APPROVED,
          },
        };
      }),
    );
    setRows(newRows);
  };

  const toggleViewMode = () => {
    const isEditMode = tableViewMode === DatasetTableViewModeEnum.EDIT;
    if (isEditMode) {
      router.refresh();
    }
    setTableViewMode(
      isEditMode
        ? DatasetTableViewModeEnum.PREVIEW
        : DatasetTableViewModeEnum.EDIT,
    );
  };

  const calculateMatchPercentage = (
    predictiveLabelColumnField: string,
  ): { allMatchesPercentage: number; reviewedMatchesPercentage: number } => {
    let reviewedMatches = 0;
    let allMatches = 0;
    let reviewedRowsCount = 0;
    if (!groundTruthColumnField) {
      throw new Error('No ground truth column');
    }

    rows.forEach((row) => {
      const cellData = row[groundTruthColumnField];
      if (!isGroundTruthCell(cellData)) {
        return;
      }
      if (cellData.status === ENUM_Ground_truth_status.APPROVED) {
        reviewedRowsCount += 1;
      }
      if (row[predictiveLabelColumnField] === cellData.content) {
        allMatches += 1;
        if (cellData.status === ENUM_Ground_truth_status.APPROVED) {
          reviewedMatches += 1;
        }
      }
    });

    return {
      allMatchesPercentage:
        rows.length > 0
          ? Number(((allMatches / rows.length) * 100).toFixed(1))
          : 0,
      reviewedMatchesPercentage:
        reviewedRowsCount > 0
          ? Number(((reviewedMatches / reviewedRowsCount) * 100).toFixed(1))
          : 0,
    };
  };

  const updateRow = (index: number, rowData: DatasetRow) => {
    if (!rows) {
      return;
    }
    setRows((currentRows) => {
      const result = [
        ...currentRows.slice(0, index),
        { ...currentRows[index], ...rowData },
        ...currentRows.slice(index + 1),
      ];
      return result;
    });
  };

  const updateCol = (colId: number, colDef: ColDef) => {
    if (!columnDefs || !colId) {
      return;
    }
    const colIndex = columnDefs.findIndex((col) => Number(col.colId) === colId);
    setColumnDefs((currentColumnDefs) => {
      const result = [
        ...currentColumnDefs.slice(0, colIndex),
        { ...currentColumnDefs[colIndex], ...colDef },
        ...currentColumnDefs.slice(colIndex + 1),
      ];
      return result;
    });
  };

  const updatePinnedBottomRow = () => {
    const newRow: DatasetRow = {};
    columnDefs.forEach((column) => {
      if (!column.field) {
        return;
      }
      newRow[column.field] = '';
    });

    const predictiveLabelColumns = columnDefs.filter(
      (column) =>
        column.type === ENUM_Column_type.PREDICTIVE_LABEL && column.field,
    );

    predictiveLabelColumns.map((col) => {
      if (!col.field) {
        return;
      }
      const percentages = calculateMatchPercentage(col.field);
      const reviewedRowsPercentage =
        percentages.reviewedMatchesPercentage.toString();
      const allRowsPercentage = percentages.allMatchesPercentage.toString();
      newRow[col.field] =
        `${reviewedRowsPercentage}% (reviewed) | ${allRowsPercentage}% (total)`;
    });
    if (groundTruthColumnField) {
      newRow[groundTruthColumnField] = {
        id: -1,
        content: `${getNumberOfApprovedGT()} / ${rows.length} Approved`,
        status: ENUM_Ground_truth_status.PENDING,
      };
    }
    setPinnedBottomRow([newRow]);
  };

  // Handles the row highlighting (selected) to match the inspector row index
  useEffect(() => {
    const gridApi = gridRef.current?.api;
    if (!gridApi) {
      return;
    }
    const visibleNodes = gridApi.getRenderedNodes();
    const shouldSelectNode = inspectorRowIndex !== null;
    const selectedNode = visibleNodes.find((node) =>
      shouldSelectNode
        ? node.rowIndex === inspectorRowIndex
        : node.isSelected(),
    );
    if (!selectedNode) {
      return;
    }
    gridApi.setNodesSelected({
      nodes: [selectedNode],
      newValue: shouldSelectNode,
    });
    // Schedule the call to ensureNodeVisible to avoid lifecycle warning
    setTimeout(() => gridApi.ensureNodeVisible(selectedNode), 0);
  }, [inspectorRowIndex, gridRef]);

  const updateRows = useCallback(
    (rows: DatasetRow[]) => {
      setRows(rows);
    },
    [setRows],
  );

  return {
    groundTruthColumnField,
    tableViewMode,
    inspectorRowIndex,
    rows,
    columnDefs,
    pinnedBottomRow,
    gridRef,
    setInspectorRowIndex,
    updateGroundTruthCell,
    toggleViewMode,
    updateCol,
    approveAll,
    updateRows,
  };
};
