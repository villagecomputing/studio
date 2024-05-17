import { cn } from '@/lib/utils';
import { CustomTooltipProps } from 'ag-grid-react';
import React from 'react';
import { parsePipelineParameters } from '../utils/utils';

const ParametersTooltipComponent = (props: CustomTooltipProps) => {
  if (!props.value) {
    return null;
  }
  const parameters = parsePipelineParameters(props.value);

  return (
    <div className="z-overlay overflow-auto rounded border-[thin] border-border bg-white p-5">
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
    </div>
  );
};

export default ParametersTooltipComponent;
