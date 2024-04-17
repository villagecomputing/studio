import { useCallback } from 'react';
import { useLogsRowInspectorContext } from '../LogsRowInspector';
import { UseLogsRowInspectorData } from '../types';

export default function useLogsRowInspectorActions(): UseLogsRowInspectorData {
  const { rows, inspectorRowIndex, setInspectorRowIndex } =
    useLogsRowInspectorContext();

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
