import { Button } from '@/components/ui/button';
import { ArrowDownIcon, CornerDownLeftIcon } from 'lucide-react';
import React from 'react';
import { DatasetRowInspectorFooterProps } from '../types';

const DatasetRowInspectorFooter = (props: DatasetRowInspectorFooterProps) => {
  const { onApproveRow, onSkipRow } = props;
  return (
    <div className="flex h-20 w-full items-center justify-end gap-4 border-t-[1px] border-border px-6">
      <Button variant={'outline'} onClick={onSkipRow}>
        Skip <ArrowDownIcon size={24} className="ml-2" />
      </Button>
      <Button
        className="bg-green550 hover:bg-green550 hover:opacity-85"
        onClick={onApproveRow}
      >
        Approve <CornerDownLeftIcon size={24} className="ml-2" />
      </Button>
    </div>
  );
};

export default React.memo(DatasetRowInspectorFooter);
