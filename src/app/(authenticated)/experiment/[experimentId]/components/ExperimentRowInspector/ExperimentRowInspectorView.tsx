'use client';
import { BaseRowInspector } from '@/app/(authenticated)/components/base-row-inspector/BaseRowInspector';
import { BaseRowInspectorBody } from '@/app/(authenticated)/components/base-row-inspector/components/BaseRowInspectorBody';
import { BaseRowInspectorHeader } from '@/app/(authenticated)/components/base-row-inspector/components/BaseRowInspectorHeader';
import { RowInspectorType } from '@/app/(authenticated)/components/base-row-inspector/type';
import { useRef } from 'react';
import { useExperimentRowInspectorContext } from './ExperimentRowInspector';
import RowInspectorBodyRawData from './components/RowInspectorBodyRawData';
import { RowInspectorHeaderSteps } from './components/RowInspectorHeaderSteps';
import useExperimentRowInspectorActions from './hooks/useExperimentRowInspectorActions';

export const RAW_DATA_SECTION = 'RAW_DATA_SECTION';

export default function ExperimentRowInspectorView() {
  const { inspectorRowIndex, setInspectorRowIndex } =
    useExperimentRowInspectorContext();
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
          <RowInspectorHeaderSteps onStepSelected={handleStepSelected} />
        </BaseRowInspectorHeader>
        <BaseRowInspectorBody>
          <div
            ref={bodyRef}
            className="flex h-full w-full flex-col gap-2 overflow-y-auto bg-agGridHeaderHoverGrey"
          >
            <RowInspectorBodyRawData />
          </div>
        </BaseRowInspectorBody>
      </BaseRowInspector>
    </>
  );
}
