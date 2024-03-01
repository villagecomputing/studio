import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { updateGTCell } from '../actions';
import {
  AGGridDataset,
  DatasetRow,
  DatasetTableContext,
  DatasetTableViewModeEnum,
  GroundTruthCell,
  UpdateGroundTruthCellParams,
} from '../types';
import { isGroundTruthCell } from '../utils';

export const useDatasetTableContext = (
  props: AGGridDataset,
): DatasetTableContext => {
  const [rows, setRows] = useState<AGGridDataset['rowData']>(props.rowData);
  const [columnDefs] = useState<AGGridDataset['columnDefs']>(props.columnDefs);

  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tableViewMode, setTableViewMode] = useState<DatasetTableViewModeEnum>(
    DatasetTableViewModeEnum.PREVIEW,
  );
  const [inspectorRowIndex, setInspectorRowIndex] = useState<number | null>(
    null,
  );

  const groundTruthColumnField = useMemo(() => {
    return props.columnDefs.find(
      (colDef) => colDef.type === ENUM_Column_type.GROUND_TRUTH,
    )?.field;
  }, [props.columnDefs]);

  const getGroundTruthColumn = () => {
    return props.columnDefs?.find(
      (col) => col?.type === ENUM_Column_type.GROUND_TRUTH,
    );
  };

  const getNumberOfApprovedGT = () => {
    const groundTruthColumn = getGroundTruthColumn();
    return (
      props.rowData?.filter(
        (row) =>
          groundTruthColumn?.field &&
          (row[groundTruthColumn.field] as GroundTruthCell)?.status ===
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
      groundTruthCell.id,
      updateData.content || groundTruthCell.content,
      updateData.status || groundTruthCell.status,
    );
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
  ): string | undefined => {
    let matchPercentages = 0;

    const groundTruthCol = props.columnDefs?.find(
      (col) => col?.type === ENUM_Column_type.GROUND_TRUTH,
    );

    const field = groundTruthCol?.field;
    if (!field) {
      throw new Error('No ground truth column selected');
    }

    props.rowData?.forEach((row) => {
      const cellData = row[field];
      if (
        isGroundTruthCell(cellData) &&
        cellData.status === ENUM_Ground_truth_status.APPROVED &&
        row[predictiveLabelColumnField] === cellData.content
      ) {
        matchPercentages += 1;
      }
    });

    // Calculate percentages
    const totalRows =
      props.rowData?.filter((row) => {
        const cellData = row[field];
        return (
          isGroundTruthCell(cellData) &&
          cellData.status === ENUM_Ground_truth_status.APPROVED
        );
      }).length || 0;
    if (!totalRows) {
      return undefined;
    }
    return ((matchPercentages / totalRows) * 100).toFixed(1);
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

  return {
    refreshData: router.refresh,
    updateGroundTruthCell,
    getNumberOfApprovedGT,
    toggleViewMode,
    calculateMatchPercentage,
    groundTruthColumnField,
    tableViewMode,
    inspectorRowIndex,
    setInspectorRowIndex,
    rows,
    columnDefs,
  };
};
