import { ARROW_DOWN, ARROW_UP, ENTER, ESCAPE } from '@/lib/constants';
import { ENUM_Ground_truth_status } from '@/lib/types';
import { useCallback, useEffect, useRef } from 'react';
import { GroundTruthCell } from '../../types';
import { isGroundTruthCell } from '../../utils';
import { useDatasetRowInspectorContext } from './DatasetRowInspectorView';
import { UseDatasetRowInspectorData } from './types';

export default function useDatasetRowInspectorData(): UseDatasetRowInspectorData {
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

  const approveRow = useCallback(async () => {
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
  }, [
    inspectorRowIndex,
    currentGroundTruthCell,
    groundTruthInputValue,
    navigateTo,
    updateGroundTruthCell,
  ]);

  const approveRowRef = useRef(approveRow);
  const nextRowRef = useRef(navigateTo);

  useEffect(() => {
    approveRowRef.current = approveRow;
    nextRowRef.current = navigateTo;
  }, [approveRow, navigateTo]);

  const handleKeyDown = async (event: KeyboardEvent) => {
    switch (event.key) {
      case ESCAPE:
        setInspectorRowIndex(null);
        return;
      case ENTER:
        await approveRowRef.current();
        return;
      case ARROW_UP:
        await nextRowRef.current('PREVIOUS');
        return;
      case ARROW_DOWN:
        await nextRowRef.current('NEXT');
        return;
      default:
        return;
    }
  };

  // Add event listener on mount
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return {
    approveRow,
    navigateTo,
  };
}
