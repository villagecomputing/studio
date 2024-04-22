import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import React from 'react';
import { parsePipelineParameters } from '../../utils/utils';

type PipelineParametersPopoverProps = {
  pipelineParameters: string;
  align?: 'center' | 'start' | 'end' | undefined;
  children: React.ReactNode;
};
const PipelineParametersPopover: React.FC<PipelineParametersPopoverProps> = ({
  pipelineParameters,
  children,
  align = 'start',
}) => {
  const parameters = parsePipelineParameters(pipelineParameters);

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side="bottom"
        align={align}
        className="relative top-1 z-dialog w-full max-w-xl rounded-lg border border-gridBorderColor bg-white p-6 shadow"
      >
        <>
          <div className="pb-4 font-medium">Parameters</div>

          {!parameters.length ? (
            <span className="text-sm text-muted-foreground">No parameters</span>
          ) : (
            <div
              className={`grid grid-flow-row overflow-y-auto`}
              style={{
                gridTemplateColumns: `repeat(2, max-content)`,
                maxHeight: 'calc(100vh - 200px)',
              }}
            >
              {parameters.map((parameter, index) =>
                Object.entries(parameter).map(([key, value]) => {
                  return (
                    <React.Fragment key={index}>
                      <div
                        className={cn([
                          'py-2 pr-4 text-muted-foreground',
                          index > 0 && 'border-t border-border',
                        ])}
                      >
                        {key}
                      </div>
                      <div
                        className={cn([
                          'max-w-80 py-2',
                          index > 0 && 'border-t border-border',
                        ])}
                      >
                        {value}
                      </div>
                    </React.Fragment>
                  );
                }),
              )}
            </div>
          )}
        </>
      </PopoverContent>
    </Popover>
  );
};

export default PipelineParametersPopover;
