import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateGTCell } from '../actions';
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

  const updateGroundTruthCell = async (
    rowId: number,
    content: string,
    status: string,
  ) => {
    await updateGTCell(rowId, content, status);
  };

  return {
    refreshData: router.refresh,
    updateGroundTruthCell,
    getNumberOfApprovedGT,
    tableViewMode,
    ...props,
  };
};
