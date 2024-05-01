'use client';
import Breadcrumb from '@/components/Breadcrumb';
import Loading from '@/components/loading/Loading';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { useToast } from '@/components/ui/use-toast';
import { LOGS_REFETCH_INTERVAL_MS } from '@/lib/constants';
import {
  UUIDPrefixEnum,
  cn,
  createFakeId,
  getUuidFromFakeId,
} from '@/lib/utils';
import { InfoIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import useSWR from 'swr';
import PageHeader from '../../components/page-header/PageHeader';
import CopyIdToClipboardButton from '../../data/[datasetId]/components/CopyIdToClipboardButton';
import Header from '../../experiment/[experimentId]/components/Header';
import { fetchLogs } from './actions';
import CopyLogsToDatasetDialog from './components/CopyLogsToDatasetDialog';
import LogsTable from './components/LogsTable';
import { LogsViewPageProps } from './types';

export default function LogsViewPage(props: LogsViewPageProps) {
  const logsId = getUuidFromFakeId(props.params.logsId, UUIDPrefixEnum.LOGS);
  const {
    data: logs,
    error,
    isLoading,
  } = useSWR(logsId, fetchLogs, {
    refreshInterval: LOGS_REFETCH_INTERVAL_MS,
  });
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [rowIdsToCopyToDataset, setRowIdsToCopyToDataset] = useState<string[]>(
    [],
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (error) {
      toast({ value: 'Failed to get logs details', variant: 'destructive' });
      console.error(error);
    }
    if (!logs) {
      redirect('/logs');
    }
  }, [logs, isLoading, error]);

  const onClickCopyToDataset = () => {
    if (!logs?.datasetUuid) {
      setDialogOpen(true);
      return;
    }

    copyToDataset(logs.datasetName ?? '');
  };

  const copyToDataset = async (datasetTitle: string) => {
    if (!rowIdsToCopyToDataset.length) {
      return;
    }
    const reqResponse = await fetch(`/api/logs/${logs?.logsId}/copyToDataset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        datasetName: datasetTitle,
        logsRowIndices: rowIdsToCopyToDataset,
      }),
    });
    if (reqResponse.status !== 200) {
      toast({
        value: `Failed to copy logs to ${datasetTitle} dataset`,
        variant: 'destructive',
      });
    }
    await reqResponse.json();

    toast({
      title: 'Logs copied to dataset',
      description: `Successfully copied the logs to ${datasetTitle} dataset.`,
      variant: 'default',
    });
  };

  if (!logs) {
    return <Loading />;
  }
  return (
    <>
      <div>
        <PageHeader>
          <div className={cn(['flex items-center gap-2'])}>
            <Breadcrumb
              customSegments={{
                [logsId.toString()]: logs?.logsName,
              }}
            />
            <CopyIdToClipboardButton id={createFakeId(logs.logsName, logsId)} />
          </div>
        </PageHeader>
        <div className="flex items-start justify-between">
          <Header {...logs} parametersButtonVariant="outline">
            <DatePickerWithRange
              selectedDateRange={dateRange}
              setDateRange={setDateRange}
            />
          </Header>
          <Button
            className="mx-4 mb-4 mt-2"
            variant={'outline'}
            onClick={onClickCopyToDataset}
          >
            Copy to Dataset
          </Button>
        </div>

        {!logs.rowData.length ? (
          <div className="border-t border-gridBorderColor pt-6">
            <div className="flex w-full items-center justify-center gap-2 text-muted-foreground">
              <InfoIcon size={20} />
              <span>No logs data.</span>
            </div>
          </div>
        ) : (
          <div style={{ height: 'calc(100vh - 130px)' }}>
            <LogsTable
              {...logs}
              dateRange={dateRange}
              setDateRange={setDateRange}
              setRowIdsToCopyToDataset={setRowIdsToCopyToDataset}
            />
          </div>
        )}
      </div>
      <CopyLogsToDatasetDialog
        open={dialogOpen}
        onCancel={() => {
          setDialogOpen(false);
        }}
        onAction={copyToDataset}
      />
    </>
  );
}
