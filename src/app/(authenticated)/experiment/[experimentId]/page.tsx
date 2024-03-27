import Breadcrumb from '@/components/Breadcrumb';
import { cn } from '@/lib/utils';
import { InfoIcon } from 'lucide-react';
import { fetchExperiment } from './actions';
import ExperimentTable from './components/ExperimentTable';
import Header from './components/Header';
import { ExperimentViewPageProps } from './types';

export default async function ExperimentViewPage(
  props: ExperimentViewPageProps,
) {
  const experimentId = props.params.experimentId;
  const experiment = await fetchExperiment(experimentId);

  return (
    <div>
      <div className={cn(['px-6'])}>
        <Breadcrumb
          customSegments={{
            [experimentId.toString()]: experiment?.experimentName,
          }}
        />
      </div>
      <Header experiment={experiment} />

      {!experiment.rowData.length ? (
        <div className="border-t border-gridBorderColor pt-6">
          <div className="flex w-full items-center justify-center gap-2 text-muted-foreground">
            <InfoIcon size={20} />
            <span>No experiment data.</span>
          </div>
        </div>
      ) : (
        <div style={{ height: 'calc(100vh - 130px)' }}>
          <ExperimentTable {...experiment} />
        </div>
      )}
    </div>
  );
}
