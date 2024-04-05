import Breadcrumb from '@/components/Breadcrumb';
import { cn, createFakeId, getExperimentUuidFromFakeId } from '@/lib/utils';
import { ChevronRightIcon, InfoIcon } from 'lucide-react';
import Link from 'next/link';
import { colors } from '../../../../../tailwind.config';
import CopyIdToClipboardButton from '../../data/[datasetId]/components/CopyIdToClipboardButton';
import { fetchExperiment } from './actions';
import ExperimentTable from './components/ExperimentTable';
import Header from './components/Header';
import { ExperimentViewPageProps } from './types';

export default async function ExperimentViewPage(
  props: ExperimentViewPageProps,
) {
  const experimentId = getExperimentUuidFromFakeId(props.params.experimentId);
  const experiment = await fetchExperiment(experimentId);

  return (
    <div>
      <div className={cn(['flex items-center gap-2 px-6'])}>
        <Breadcrumb
          customSegments={{
            experiment: <Link href={`/experiment`}>Experiments</Link>,
            [props.params.experimentId.toString()]: (
              <span className="flex items-center gap-1.5 text-lg">
                <Link
                  className="text-slateGray700"
                  href={`/group/${experiment.groupId.toString()}`}
                >
                  {experiment.groupId.toString()}
                </Link>
                <ChevronRightIcon color={colors.slateGray500} size={18} />
                <span className="text-slateGray950">
                  {experiment.experimentName}
                </span>
              </span>
            ),
          }}
        />
        <CopyIdToClipboardButton
          id={createFakeId(experiment.experimentName, experimentId)}
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
