'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
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
  const [popoverPosition, setPopoverPosition] = useState<'top' | 'bottom'>(
    'bottom',
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (triggerRef.current && popoverRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const spaceAbove = triggerRect.top;
      const spaceBelow = window.innerHeight - triggerRect.bottom;

      if (spaceBelow < popoverRect.height && spaceAbove > spaceBelow) {
        setPopoverPosition('top');
      } else {
        setPopoverPosition('bottom');
      }
    }
  }, [children]);

  return (
    <Popover>
      <PopoverTrigger asChild ref={triggerRef}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        ref={popoverRef}
        side={popoverPosition}
        align={align}
        className="relative top-1 z-dialog w-full max-w-xl rounded-lg border border-gridBorderColor bg-white p-6 shadow"
        style={{
          maxHeight: `calc(100vh - ${popoverPosition === 'top' ? triggerRef.current?.getBoundingClientRect().bottom : triggerRef.current?.getBoundingClientRect().top}px - 150px)`,
          overflowY: 'auto',
          minHeight: 150,
        }}
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
