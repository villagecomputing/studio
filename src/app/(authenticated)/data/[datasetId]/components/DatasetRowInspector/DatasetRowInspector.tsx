'use client';
import { useEffect, useRef } from 'react';
import { useDatasetRowInspectorContext } from './DatasetRowInspectorView';
import DatasetRowInspectorBody from './components/DatasetRowInspectorBody';
import { INSPECTOR_DROPDOWN_ATTRIBUTE } from './components/DatasetRowInspectorBodyElement';
import DatasetRowInspectorFooter from './components/DatasetRowInspectorFooter';
import useDatasetRowInspectorData from './useDatasetRowInspectorData';

export default function DatasetRowInspector() {
  const { inspectorRowIndex, setInspectorRowIndex } =
    useDatasetRowInspectorContext();
  const { approveRow, navigateTo } = useDatasetRowInspectorData();
  const viewRef = useRef(null);

  const inspectorClass =
    inspectorRowIndex !== null ? 'row-inspector-view-active' : '';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        viewRef.current &&
        !(viewRef.current as HTMLElement).contains(target) &&
        !target.closest('.ag-row') &&
        !document.body.hasAttribute(INSPECTOR_DROPDOWN_ATTRIBUTE)
      ) {
        setInspectorRowIndex(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [viewRef]);

  return (
    <div
      ref={viewRef}
      className={`row-inspector-view absolute bottom-0 right-0 top-0 z-inspectorView flex w-full max-w-inspectorView translate-x-full flex-col bg-white ${inspectorClass}`}
    >
      <DatasetRowInspectorBody />
      <DatasetRowInspectorFooter
        onSkipRow={() => navigateTo('NEXT')}
        onApproveRow={approveRow}
      />
    </div>
  );
}
