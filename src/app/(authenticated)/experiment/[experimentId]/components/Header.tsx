import { Button } from '@/components/ui/button';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import { ColDef } from 'ag-grid-community';
import { BracesIcon } from 'lucide-react';
import React from 'react';
import MetadataElement, { Enum_Metadata_Type } from './MetadataElement';
import PipelineParametersPopover from './PipelineParametersPopover';

type HeaderProps = {
  children?: React.ReactNode;
  cost: number;
  latencyP50: number;
  latencyP90: number;
  accuracy: number;
  runtime: number;
  parameters: string;
  columnDefs: ColDef[];
  description?: string;
  parametersButtonVariant?: 'outline' | 'secondary';
};
const Header: React.FC<HeaderProps> = ({
  cost,
  latencyP50,
  latencyP90,
  accuracy,
  runtime,
  columnDefs,
  parameters,
  children,
  description,
  parametersButtonVariant = 'secondary',
}) => {
  const stepsCount = columnDefs.filter(
    (col) => col.type === Enum_Experiment_Column_Type.STEP_METADATA,
  ).length;

  return (
    <div className="grid grid-cols-[min-content] gap-4 px-4 pb-4 pt-2">
      <div className="flex gap-4">
        {children}
        <PipelineParametersPopover pipelineParameters={parameters}>
          <Button variant={parametersButtonVariant}>
            <span className="flex items-center gap-2.5">
              <BracesIcon size={16} />
              View Parameters
            </span>
          </Button>
        </PipelineParametersPopover>

        <div className="flex h-10 gap-6 rounded-lg border border-gridBorderColor px-4 py-2">
          <MetadataElement type={Enum_Metadata_Type.COST} icon value={cost} />
          <MetadataElement
            type={Enum_Metadata_Type.LATENCY50}
            icon
            label={'P50'}
            value={latencyP50}
          />
          <MetadataElement
            type={Enum_Metadata_Type.LATENCY90}
            icon
            label={'P90'}
            value={latencyP90}
          />
          <MetadataElement
            type={Enum_Metadata_Type.ACCURACY}
            icon
            value={accuracy}
          />
          <MetadataElement
            type={Enum_Metadata_Type.RUNTIME}
            label="Runtime"
            value={runtime}
          />
          <MetadataElement
            type={Enum_Metadata_Type.LABEL_VALUE}
            label="Steps"
            value={stepsCount}
          />
        </div>
      </div>
      {description && (
        <p className="line-clamp-2 text-sm text-gridHeaderTextColor">
          {description}
        </p>
      )}
    </div>
  );
};

export default Header;
