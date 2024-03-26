import Breadcrumb from '@/components/Breadcrumb';
import { cn } from '@/lib/utils';

import { fetchExperiment } from './actions';
import ExperimentTable from './components/ExperimentTable';
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
      {experiment && (
        <div style={{ height: 'calc(100vh - 130px)' }}>
          <ExperimentTable
            experimentName={experiment.experimentName}
            experimentId={experimentId}
            rowData={experiment.rowData}
            columnDefs={experiment.columnDefs}
          />
        </div>
      )}
    </div>
  );
}
