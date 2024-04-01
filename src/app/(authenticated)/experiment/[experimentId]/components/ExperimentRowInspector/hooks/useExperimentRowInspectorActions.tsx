import { useCallback } from 'react';
import { useExperimentRowInspectorContext } from '../ExperimentRowInspector';
import { UseExperimentRowInspectorData } from '../types';

export default function useExperimentRowInspectorActions(): UseExperimentRowInspectorData {
  const { rows, inspectorRowIndex, setInspectorRowIndex } =
    useExperimentRowInspectorContext();

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

  return {
    navigateTo,
  };
}
