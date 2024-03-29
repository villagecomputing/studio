'use client';
import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/popover';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { BracesIcon } from 'lucide-react';
import { DatasetName } from '../../components/DatasetNameCellRenderer';
import { FetchExperimentResult } from '../types';
import MetadataElement, { Enum_Metadata_Type } from './MetadataElement';

type HeaderProps = {
  experiment: FetchExperimentResult;
};
const Header: React.FC<HeaderProps> = ({ experiment }) => {
  const parameters = JSON.parse(experiment.parameters);
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
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={'secondary'}>
            <span className="flex items-center gap-2.5">
              <BracesIcon size={16} />
              View Parameters
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" className="z-overlay">
          <div className="relative top-1 z-inspectorView rounded border border-gridBorderColor bg-white p-6 shadow">
            <div className="pb-4 font-medium">Parameters</div>
            <div
              className={`grid gap-y-2`}
              style={{
                gridTemplateColumns: `repeat(${Object.keys(parameters).length}, max-content)`,
                gridTemplateRows: `repeat(2, min-content)`,
              }}
            >
              {Object.keys(parameters).map((key, index) => (
                <div
                  key={key}
                  className={cn([
                    'col-span-1 row-span-1 text-muted-foreground',
                    index !== 0 && 'pl-4',
                  ])}
                >
                  {key}
                </div>
              ))}

              {Object.values(parameters).map((value, index) => (
                <div
                  key={index}
                  className={cn([
                    'col-span-1 row-span-1 border-t border-gridBorderColor pt-2',
                    index !== 0 && 'pl-4',
                  ])}
                >
                  {typeof value === 'object'
                    ? JSON.stringify(value)
                    : value?.toString()}
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex h-10 gap-6 rounded-lg border border-gridBorderColor px-4 py-2">
        <MetadataElement
          type={Enum_Metadata_Type.COST}
          icon
          value={experiment.cost}
        />
        <MetadataElement
          type={Enum_Metadata_Type.LATENCY}
          icon
          label={'P50'}
          value={experiment.latencyP50}
        />
        <MetadataElement
          type={Enum_Metadata_Type.LATENCY}
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
