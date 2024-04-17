'use client';
import { Button } from '@/components/ui/button';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import { BracesIcon } from 'lucide-react';
import React from 'react';
import { DatasetName } from '../../components/DatasetNameCellRenderer';
import { FetchExperimentResult } from '../types';
import MetadataElement, { Enum_Metadata_Type } from './MetadataElement';
import PipelineParametersPopover from './PipelineParametersPopover';

type HeaderProps = {
  experiment: FetchExperimentResult;
};
const Header: React.FC<HeaderProps> = ({ experiment }) => {
  const stepsCount = experiment.columnDefs.filter(
    (col) => col.type === Enum_Experiment_Column_Type.STEP_METADATA,
  ).length;

  return (
    <div className="flex gap-4 px-4 pb-4 pt-2">
      <DatasetName
        name={experiment.dataset.name}
        id={experiment.dataset.id}
        variant="secondary"
      />
      <PipelineParametersPopover pipelineParameters={experiment.parameters}>
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
          value={experiment.cost}
        />
        <MetadataElement
          type={Enum_Metadata_Type.LATENCY50}
          icon
          label={'P50'}
          value={experiment.latencyP50}
        />
        <MetadataElement
          type={Enum_Metadata_Type.LATENCY90}
          icon
          label={'P90'}
          value={experiment.latencyP90}
        />
        <MetadataElement
          type={Enum_Metadata_Type.ACCURACY}
          icon
          value={experiment.accuracy}
        />
        <MetadataElement
          type={Enum_Metadata_Type.RUNTIME}
          label="Runtime"
          value={experiment.runtime}
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
