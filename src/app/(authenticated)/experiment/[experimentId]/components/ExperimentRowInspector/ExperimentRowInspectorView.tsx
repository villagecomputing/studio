'use client';
import { BaseRowInspector } from '@/app/(authenticated)/components/base-row-inspector/BaseRowInspector';
import { BaseRowInspectorBody } from '@/app/(authenticated)/components/base-row-inspector/components/BaseRowInspectorBody';
import { BaseRowInspectorHeader } from '@/app/(authenticated)/components/base-row-inspector/components/BaseRowInspectorHeader';
import { RowInspectorType } from '@/app/(authenticated)/components/base-row-inspector/type';
import { useRef } from 'react';
import { useExperimentRowInspectorContext } from './ExperimentRowInspector';
import RowInspectorBodyMetaData from './components/RowInpsectorBodyMetaData';
import RowInspectorBodyRawData from './components/RowInspectorBodyRawData';
import RowInspectorBodyStepData from './components/RowInspectorBodyStepData';
import { RowInspectorHeaderSteps } from './components/RowInspectorHeaderSteps';
import useExperimentRowInspectorActions from './hooks/useExperimentRowInspectorActions';

export const RAW_DATA_SECTION = 'RAW_DATA_SECTION';

export default function ExperimentRowInspectorView() {
  const context = useExperimentRowInspectorContext();
  const {
    inspectorRowIndex,
    setInspectorRowIndex,
    stepMetadataColumns,
    columnDefs,
    datasetId,
  } = context;
  const { navigateTo } = useExperimentRowInspectorActions();
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
          <RowInspectorHeaderSteps
            onStepSelected={handleStepSelected}
            columnDefs={columnDefs}
          />
        </BaseRowInspectorHeader>
        <BaseRowInspectorBody>
          <div
            ref={bodyRef}
            className="flex h-full w-full flex-col gap-2 overflow-y-auto bg-agGridHeaderHoverGrey"
          >
            <RowInspectorBodyMetaData context={context} />
            <RowInspectorBodyRawData context={context} datasetId={datasetId} />
            {stepMetadataColumns.map((column) => (
              <RowInspectorBodyStepData
                key={column.field}
                stepMetadataColumn={column}
                context={context}
              />
            ))}
          </div>
        </BaseRowInspectorBody>
      </BaseRowInspector>
    </>
  );
}
