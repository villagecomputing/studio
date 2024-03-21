import { ENUM_Ground_truth_status } from '@/lib/types';
import { useCallback } from 'react';
import { GroundTruthCell } from '../../../types';
import { isGroundTruthCell } from '../../../utils/commonUtils';
import { useDatasetRowInspectorContext } from '../DatasetRowInspector';
import { UseDatasetRowInspectorData } from '../types';

export default function useDatasetRowInspectorActions(): UseDatasetRowInspectorData {
  const {
    rows,
    inspectorRowIndex,
    setInspectorRowIndex,
    updateGroundTruthCell,
    groundTruthColumnField,
    groundTruthInputValue,
  } = useDatasetRowInspectorContext();

  const rowToInspect =
    rows && inspectorRowIndex !== null ? rows[inspectorRowIndex] : null;

  const currentGroundTruthCell: GroundTruthCell | null =
    rowToInspect &&
    groundTruthColumnField &&
    isGroundTruthCell(rowToInspect[groundTruthColumnField])
      ? (rowToInspect[groundTruthColumnField] as GroundTruthCell)
      : null;

  const navigateTo = useCallback(
    async (direction: 'NEXT' | 'PREVIOUS') => {
      if (!rows || inspectorRowIndex === null) {
        return;
      }
      const nextIndex =
        direction === 'NEXT' ? inspectorRowIndex + 1 : inspectorRowIndex - 1;
      const toIndex: number | null = rows[nextIndex] ? nextIndex : null;
      setInspectorRowIndex(toIndex);
    },
    [rows, inspectorRowIndex, setInspectorRowIndex],
  );

  const approveRow = async () => {
    if (!currentGroundTruthCell || inspectorRowIndex === null) {
      return;
    }
    if (
      currentGroundTruthCell.status === ENUM_Ground_truth_status.APPROVED &&
      currentGroundTruthCell.content === groundTruthInputValue
    ) {
      navigateTo('NEXT');
      return;
    }
    await updateGroundTruthCell({
      rowIndex: inspectorRowIndex,
      content: groundTruthInputValue,
      status: ENUM_Ground_truth_status.APPROVED,
    });
    navigateTo('NEXT');
  };

  return {
    groundTruthCell: currentGroundTruthCell,
    approveRow,
    navigateTo,
  };
}
