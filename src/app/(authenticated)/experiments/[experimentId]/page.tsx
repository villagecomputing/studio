import Breadcrumb from '@/components/Breadcrumb';
import { cn } from '@/lib/utils';
import { ExperimentViewPageProps } from '../types';

export default async function ExperimentViewPage(
  props: ExperimentViewPageProps,
) {
  const experimentId = Number(props.params.experimentId);

  return (
    <div>
      <div className={cn(['px-6'])}>
        <Breadcrumb />
      </div>
      <span>Experiment Data for {experimentId}</span>
    </div>
  );
}
