'use client';
import { Button } from '@/components/ui/button';
import { Enum_Logs_Column_Type } from '@/lib/types';
import { BracesIcon } from 'lucide-react';
import React from 'react';
import { FetchLogsResult } from '../types';
import MetadataElement, { Enum_Metadata_Type } from './MetadataElement';
import PipelineParametersPopover from './PipelineParametersPopover';

type HeaderProps = {
  logs: FetchLogsResult;
};
const Header: React.FC<HeaderProps> = ({ logs }) => {
  const stepsCount = logs.columnDefs.filter(
    (col) => col.type === Enum_Logs_Column_Type.STEP_METADATA,
  ).length;

  return (
    <div className="flex gap-4 px-4 pb-4 pt-2">
      <PipelineParametersPopover pipelineParameters={logs.parameters}>
        <Button variant={'secondary'}>
          <span className="flex items-center gap-2.5">
            <BracesIcon size={16} />
            View Parameters
          </span>
        </Button>
      </PipelineParametersPopover>

      <div className="flex h-10 gap-6 rounded-lg border border-gridBorderColor px-4 py-2">
        <MetadataElement
          type={Enum_Metadata_Type.COST}
          icon
          value={logs.cost}
        />
        <MetadataElement
          type={Enum_Metadata_Type.LATENCY50}
          icon
          label={'P50'}
          value={logs.latencyP50}
        />
        <MetadataElement
          type={Enum_Metadata_Type.LATENCY90}
          icon
          label={'P90'}
          value={logs.latencyP90}
        />
        <MetadataElement
          type={Enum_Metadata_Type.ACCURACY}
          icon
          value={logs.accuracy}
        />
        <MetadataElement
          type={Enum_Metadata_Type.RUNTIME}
          label="Runtime"
          value={logs.runtime}
        />
        <MetadataElement
          type={Enum_Metadata_Type.LABEL_VALUE}
          label="Steps"
          value={stepsCount}
        />
      </div>
    </div>
  );
};

export default Header;
