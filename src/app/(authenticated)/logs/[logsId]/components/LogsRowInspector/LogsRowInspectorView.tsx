'use client';
import { BaseRowInspector } from '@/app/(authenticated)/components/base-row-inspector/BaseRowInspector';
import { BaseRowInspectorBody } from '@/app/(authenticated)/components/base-row-inspector/components/BaseRowInspectorBody';
import { BaseRowInspectorHeader } from '@/app/(authenticated)/components/base-row-inspector/components/BaseRowInspectorHeader';
import { RowInspectorType } from '@/app/(authenticated)/components/base-row-inspector/type';
import RowInspectorBodyMetaData from '@/app/(authenticated)/experiment/[experimentId]/components/ExperimentRowInspector/components/RowInpsectorBodyMetaData';
import RowInspectorBodyRawData from '@/app/(authenticated)/experiment/[experimentId]/components/ExperimentRowInspector/components/RowInspectorBodyRawData';
import RowInspectorBodyStepData from '@/app/(authenticated)/experiment/[experimentId]/components/ExperimentRowInspector/components/RowInspectorBodyStepData';
import { RowInspectorHeaderSteps } from '@/app/(authenticated)/experiment/[experimentId]/components/ExperimentRowInspector/components/RowInspectorHeaderSteps';
import { useInspectorStepScroll } from '@/app/(authenticated)/experiment/[experimentId]/components/ExperimentRowInspector/hooks/useInspectorStepScroll';
import { useLogsRowInspectorContext } from './LogsRowInspector';
import useLogsRowInspectorActions from './hooks/useLogsRowInspectorActions';
export const RAW_DATA_SECTION = 'RAW_DATA_SECTION';

export default function LogsRowInspectorView() {
  const context = useLogsRowInspectorContext();
  const {
    inspectorRowIndex,
    setInspectorRowIndex,
    stepMetadataColumns,
    columnDefs,
  } = context;
  const { navigateTo } = useLogsRowInspectorActions();
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
            <RowInspectorBodyRawData context={context} />
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
