import { Popover } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import React from 'react';
import { parsePipelineParameters } from '../../utils/utils';

type PipelineParametersPopoverProps = {
  pipelineParameters: string;
  children: React.ReactNode;
};
const PipelineParametersPopover: React.FC<PipelineParametersPopoverProps> = ({
  pipelineParameters,
  children,
}) => {
  const parameters = parsePipelineParameters(pipelineParameters);

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="z-dialog">
        <div className="relative top-1 rounded-lg border border-gridBorderColor bg-white p-6 shadow">
          <div className="pb-4 font-medium">Parameters</div>
          <div
            className={`grid grid-flow-row`}
            style={{
              gridTemplateColumns: `repeat(2, max-content)`,
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
                        'py-2',
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
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PipelineParametersPopover;
