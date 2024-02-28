import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { updateCellStatus } from '../actions';
import {
  AGGridDataset,
  DatasetTableContext,
  DatasetTableViewModeEnum,
} from '../types';

export const useDatasetTableContext = (
  props: AGGridDataset,
): DatasetTableContext => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tableViewMode, setTableViewMode] = useState<DatasetTableViewModeEnum>(
    DatasetTableViewModeEnum.PREVIEW,
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
          row[groundTruthColumn.field]?.status ===
            ENUM_Ground_truth_status.APPROVED,
      )?.length ?? 0
    );
  };

  const updateGroundTruthRowStatus = async (
    rowId: number,
    checked: CheckedState,
  ) => {
    await updateCellStatus(
      rowId,
      checked
        ? ENUM_Ground_truth_status.APPROVED
        : ENUM_Ground_truth_status.PENDING,
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
  ): string => {
    let matchPercentages = 0;

    const groundTruthCol = props.columnDefs?.find(
      (col) => col?.type === ENUM_Column_type.GROUND_TRUTH,
    );

    const field = groundTruthCol?.field;
    if (!field) {
      throw new Error('No ground truth column selected');
    }

    props.rowData?.forEach((row) => {
      if (
        row[field].status === ENUM_Ground_truth_status.APPROVED &&
        row[predictiveLabelColumnField] === row[field].content
      ) {
        matchPercentages += 1;
      }
    });

    // Calculate percentages
    const totalRows =
      props.rowData?.filter(
        (row) => row[field].status === ENUM_Ground_truth_status.APPROVED,
      ).length || 0;
    return ((matchPercentages / totalRows) * 100).toFixed(1);
  };

  return {
    refreshData: router.refresh,
    updateGroundTruthRowStatus,
    getNumberOfApprovedGT,
    toggleViewMode,
    calculateMatchPercentage,
    groundTruthColumnField,
    tableViewMode,
    ...props,
  };
};
