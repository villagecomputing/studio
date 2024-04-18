import { LogsTableContext } from '@/app/(authenticated)/logs/[logsId]/types';
import { Button } from '@/components/ui/button';
import { CustomNoRowsOverlayProps } from 'ag-grid-react';
import Image from 'next/image';

export type CustomNoRowsOverlayParams = {
  resetFilter: () => void;
  isFilterPresent: boolean;
  text?: string;
};
export const CustomNoRowsOverlay = (
  params: CustomNoRowsOverlayProps<unknown, LogsTableContext> &
    CustomNoRowsOverlayParams,
) => {
  return (
    <div className="mb-9 flex flex-col items-center gap-4">
      <Image
        src={'/data-not-found.svg'}
        alt="data not found"
        width={59}
        height={66}
        className="mb-9"
      />
      <div className="text-base text-gray800">
        {params.text ??
          (params.isFilterPresent ? 'No matching records found.' : 'No rows')}
      </div>
      {params.isFilterPresent && (
        <Button
          className="w-fit"
          variant={'outline'}
          onClick={params.resetFilter}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
};
