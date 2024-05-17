'use client';
import { BaseRowInspector } from '@/app/(authenticated)/components/base-row-inspector/BaseRowInspector';
import { BaseRowInspectorBody } from '@/app/(authenticated)/components/base-row-inspector/components/BaseRowInspectorBody';
import { BaseRowInspectorHeader } from '@/app/(authenticated)/components/base-row-inspector/components/BaseRowInspectorHeader';
import { RowInspectorType } from '@/app/(authenticated)/components/base-row-inspector/type';
import { useExperimentRowInspectorContext } from './ExperimentRowInspector';
import RowInspectorBodyMetaData from './components/RowInpsectorBodyMetaData';
import RowInspectorBodyRawData from './components/RowInspectorBodyRawData';
import RowInspectorBodyStepData from './components/RowInspectorBodyStepData';
import { RowInspectorHeaderSteps } from './components/RowInspectorHeaderSteps';
import useExperimentRowInspectorActions from './hooks/useExperimentRowInspectorActions';
import { useInspectorStepScroll } from './hooks/useInspectorStepScroll';

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
  const { bodyRef, headerRef, handleStepSelected } =
    useInspectorStepScroll(stepMetadataColumns);
  return (
    <>
      <BaseRowInspector
        type={RowInspectorType.EXPERIMENT}
        open={inspectorRowIndex !== null}
        onEscape={() => setInspectorRowIndex(null)}
        onEnter={() => undefined}
        onNavigate={navigateTo}
      >
        <div ref={headerRef}>
          <BaseRowInspectorHeader
            title={`Row ${inspectorRowIndex}`}
            onClose={() => setInspectorRowIndex(null)}
          >
            <RowInspectorHeaderSteps
              onStepSelected={handleStepSelected}
              columnDefs={columnDefs}
            />
          </BaseRowInspectorHeader>
        </div>
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
