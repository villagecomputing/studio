import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
    DatasetTableViewModeEnum.EDIT,
  );

  const getTableViewMode = () => {
    return tableViewMode;
  };

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

  return {
    refreshData: router.refresh,
    getTableViewMode,
    updateGroundTruthRowStatus,
    getNumberOfApprovedGT,
    ...props,
  };
};
