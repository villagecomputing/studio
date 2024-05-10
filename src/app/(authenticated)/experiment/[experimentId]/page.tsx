'use client';
import Breadcrumb from '@/components/Breadcrumb';
import Loading from '@/components/loading/Loading';
import { useToast } from '@/components/ui/use-toast';
import { EXPERIMENT_REFETCH_INTERVAL_MS } from '@/lib/constants';
import {
  UUIDPrefixEnum,
  cn,
  createFakeId,
  getUuidFromFakeId,
} from '@/lib/utils';
import { ChevronRightIcon, InfoIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';
import { colors } from '../../../../../tailwind.config';
import PageHeader from '../../components/page-header/PageHeader';
import CopyIdToClipboardButton from '../../data/[datasetId]/components/CopyIdToClipboardButton';
import { DatasetName } from '../components/DatasetNameCellRenderer';
import { fetchExperiment } from './actions';
import ExperimentTable from './components/ExperimentTable';
import Header from './components/Header';
import { ExperimentViewPageProps } from './types';

export default function ExperimentViewPage(props: ExperimentViewPageProps) {
  const experimentId = getUuidFromFakeId(
    props.params.experimentId,
    UUIDPrefixEnum.EXPERIMENT,
  );
  const {
    data: experiment,
    error,
    isLoading,
  } = useSWR(experimentId, fetchExperiment, {
    refreshInterval: EXPERIMENT_REFETCH_INTERVAL_MS,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (error) {
      toast({
        value: 'Failed to get experiment details',
        variant: 'destructive',
      });
      console.error(error);
    }
    if (!experiment) {
      redirect('/experiment');
    }
  }, [experiment, isLoading, error]);

  if (!experiment) {
    return <Loading />;
  }

  return (
    <div>
      <PageHeader>
        <div className={cn(['flex items-center gap-2'])}>
          <Breadcrumb
            customSegments={{
              experiment: <Link href={`/experiment`}>Experiments</Link>,
              [props.params.experimentId.toString()]: (
                <span className="flex items-center gap-1.5 text-lg">
                  <Link
                    className="text-slateGray700"
                    href={`/group/${experiment.groupId}`}
                  >
                    {experiment.groupId}
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
      </PageHeader>
      <Header {...experiment}>
        <DatasetName
          name={experiment.dataset.name}
          id={experiment.dataset.id}
          variant="secondary"
        />
      </Header>
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
