'use client';
import { BaseRowInspector } from '@/app/(authenticated)/components/base-row-inspector/BaseRowInspector';
import { BaseRowInspectorBody } from '@/app/(authenticated)/components/base-row-inspector/components/BaseRowInspectorBody';
import { BaseRowInspectorFooter } from '@/app/(authenticated)/components/base-row-inspector/components/BaseRowInspectorFooter';
import { BaseRowInspectorHeader } from '@/app/(authenticated)/components/base-row-inspector/components/BaseRowInspectorHeader';
import { RowInspectorType } from '@/app/(authenticated)/components/base-row-inspector/type';
import { Button } from '@/components/ui/button';
import { ArrowDownIcon, CornerDownLeftIcon } from 'lucide-react';
import { useDatasetRowInspectorContext } from './DatasetRowInspector';
import DatasetRowInspectorBody from './components/DatasetRowInspectorBody';
import useDatasetRowInspectorData from './hooks/useDatasetRowInspectorActions';

export default function DatasetRowInspectorView() {
  const { inspectorRowIndex, setInspectorRowIndex } =
    useDatasetRowInspectorContext();
  const { approveRow, navigateTo } = useDatasetRowInspectorData();

  return (
    <>
      <BaseRowInspector
        type={RowInspectorType.DATASET}
        open={inspectorRowIndex !== null}
        onNavigate={navigateTo}
        onEscape={() => setInspectorRowIndex(null)}
        onEnter={async () => await approveRow()}
      >
        <BaseRowInspectorHeader
          title={`Row ${inspectorRowIndex}`}
          onClose={() => setInspectorRowIndex(null)}
        />
        <BaseRowInspectorBody>
          <DatasetRowInspectorBody />
        </BaseRowInspectorBody>
        <BaseRowInspectorFooter>
          <Button variant={'outline'} onClick={() => navigateTo('NEXT')}>
            Skip <ArrowDownIcon size={24} className="ml-2" />
          </Button>
          <Button
            className="bg-green550 hover:bg-green550 hover:opacity-85"
            onClick={approveRow}
          >
            Approve <CornerDownLeftIcon size={24} className="ml-2" />
          </Button>
        </BaseRowInspectorFooter>
      </BaseRowInspector>
    </>
  );
}
