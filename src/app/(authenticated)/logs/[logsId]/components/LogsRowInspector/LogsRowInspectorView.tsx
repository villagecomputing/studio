'use client';
import { BaseRowInspector } from '@/app/(authenticated)/components/base-row-inspector/BaseRowInspector';
import { BaseRowInspectorBody } from '@/app/(authenticated)/components/base-row-inspector/components/BaseRowInspectorBody';
import { BaseRowInspectorHeader } from '@/app/(authenticated)/components/base-row-inspector/components/BaseRowInspectorHeader';
import { RowInspectorType } from '@/app/(authenticated)/components/base-row-inspector/type';
import { useRef } from 'react';
import { useLogsRowInspectorContext } from './LogsRowInspector';
import RowInspectorBodyMetaData from './components/RowInpsectorBodyMetaData';
import RowInspectorBodyRawData from './components/RowInspectorBodyRawData';
import RowInspectorBodyStepData from './components/RowInspectorBodyStepData';
import { RowInspectorHeaderSteps } from './components/RowInspectorHeaderSteps';
import useLogsRowInspectorActions from './hooks/useLogsRowInspectorActions';

export const RAW_DATA_SECTION = 'RAW_DATA_SECTION';

export default function LogsRowInspectorView() {
  const { inspectorRowIndex, setInspectorRowIndex, stepMetadataColumns } =
    useLogsRowInspectorContext();
  const { navigateTo } = useLogsRowInspectorActions();
  const bodyRef = useRef<HTMLDivElement>(null);
  const handleStepSelected = (stepColumnField: string) => {
    const section = document.getElementById(stepColumnField);
    if (section && bodyRef.current) {
      section.scrollIntoView();
    }
  };

  return (
    <>
      <BaseRowInspector
        type={RowInspectorType.EXPERIMENT}
        open={inspectorRowIndex !== null}
        onEscape={() => setInspectorRowIndex(null)}
        onEnter={() => undefined}
        onNavigate={navigateTo}
      >
        <BaseRowInspectorHeader
          title={`Row ${inspectorRowIndex}`}
          onClose={() => setInspectorRowIndex(null)}
        >
          <RowInspectorHeaderSteps onStepSelected={handleStepSelected} />
        </BaseRowInspectorHeader>
        <BaseRowInspectorBody>
          <div
            ref={bodyRef}
            className="flex h-full w-full flex-col gap-2 overflow-y-auto bg-agGridHeaderHoverGrey"
          >
            <RowInspectorBodyMetaData />
            <RowInspectorBodyRawData />
            {stepMetadataColumns.map((column) => (
              <RowInspectorBodyStepData
                key={column.field}
                stepMetadataColumn={column}
              />
            ))}
          </div>
        </BaseRowInspectorBody>
      </BaseRowInspector>
    </>
  );
}
