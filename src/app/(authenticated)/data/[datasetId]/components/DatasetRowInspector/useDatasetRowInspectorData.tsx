import { ENUM_Ground_truth_status } from '@/lib/types';
import { useCallback, useEffect, useRef } from 'react';
import { GroundTruthCell } from '../../types';
import { useDatasetRowInspectorContext } from './DatasetRowInspectorView';
import { UseDatasetRowInspectorData } from './types';

export default function useDatasetRowInspectorData(): UseDatasetRowInspectorData {
  const {
    rowData,
    inspectorRowIndex,
    setInspectorRowIndex,
    updateGroundTruthCell,
    groundTruthColumnField,
    refreshData,
  } = useDatasetRowInspectorContext();

  const rowToInspect =
    rowData && inspectorRowIndex !== null ? rowData[inspectorRowIndex] : null;

  const currentGroundTruthCell: GroundTruthCell | null =
    rowToInspect && groundTruthColumnField
      ? rowToInspect[groundTruthColumnField]
      : null;

  const navigateTo = useCallback(
    async (direction: 'NEXT' | 'PREVIOUS') => {
      if (!rowData || inspectorRowIndex === null) {
        return;
      }
      const nextIndex =
        direction === 'NEXT' ? inspectorRowIndex + 1 : inspectorRowIndex - 1;
      const toIndex: number | null = rowData[nextIndex] ? nextIndex : null;
      setInspectorRowIndex(toIndex);
      if (toIndex === null) {
        refreshData();
      }
    },
    [rowData, inspectorRowIndex, refreshData, setInspectorRowIndex],
  );

  const approveRow = useCallback(async () => {
    if (!currentGroundTruthCell) {
      return;
    }
    if (currentGroundTruthCell.status === ENUM_Ground_truth_status.APPROVED) {
      navigateTo('NEXT');
      return;
    }
    await updateGroundTruthCell(
      currentGroundTruthCell.id,
      currentGroundTruthCell.content,
      ENUM_Ground_truth_status.APPROVED,
    );
    navigateTo('NEXT');
  }, [currentGroundTruthCell, navigateTo, updateGroundTruthCell]);

  const approveRowRef = useRef(approveRow);
  const nextRowRef = useRef(navigateTo);
  const refreshDataRef = useRef(refreshData);

  useEffect(() => {
    approveRowRef.current = approveRow;
    nextRowRef.current = navigateTo;
    refreshDataRef.current = refreshData;
  }, [approveRow, navigateTo, refreshData]);

  const handleKeyDown = async (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        setInspectorRowIndex(null);
        refreshData();
        return;
      case 'Enter':
        await approveRowRef.current();
        return;
      case 'ArrowUp':
        await nextRowRef.current('PREVIOUS');
        return;
      case 'ArrowDown':
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
