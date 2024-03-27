'use client';
import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { BracesIcon, Link2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FetchExperimentResult } from '../types';
import MetadataElement from './MetadataElement';

type HeaderProps = {
  experiment: FetchExperimentResult;
};
const Header: React.FC<HeaderProps> = ({ experiment }) => {
  const router = useRouter();
  const parameters = JSON.parse(experiment.parameters);

  const redirectToDataset = () => {
    if (!experiment.dataset?.id) {
      return;
    }
    router.push(`/data/${experiment.dataset.id}`);
  };

  return (
    <div className="flex gap-4 px-4 pb-4 pt-2">
      <Button variant={'secondary'} onClick={redirectToDataset}>
        <span className="flex items-center gap-2.5">
          <Link2Icon size={16} />
          {experiment.dataset.name}
        </span>
      </Button>
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
        {/* TODO: Fix the status based on value */}
        <MetadataElement
          icon={'price'}
          value={
            experiment.rowData.length
              ? `$${experiment.cost.toString()}`
              : undefined
          }
          status="disabled"
        />
        <MetadataElement
          icon={'latency'}
          label={'P50'}
          value={
            experiment.rowData.length
              ? `${experiment.latencyP50.toString()}s`
              : undefined
          }
          status="disabled"
        />
        <MetadataElement
          icon={'latency'}
          label={'P90'}
          value={
            experiment.rowData.length
              ? `${experiment.latencyP90.toString()}s`
              : undefined
          }
          status="disabled"
        />
        <MetadataElement
          icon={'accuracy'}
          value={
            experiment.rowData.length
              ? `${experiment.accuracy.toString()}%`
              : undefined
          }
          status="disabled"
        />
        {/* TODO: add values for runtime and steps */}
        <MetadataElement icon="none" label="Runtime" status="disabled" />
        <MetadataElement icon="none" label="Steps" status="disabled" />
      </div>
    </div>
  );
};

export default Header;
