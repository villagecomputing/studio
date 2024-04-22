'use client';
import Breadcrumb from '@/components/Breadcrumb';
import Loading from '@/components/loading/Loading';
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

  if (!logs) {
    return <Loading />;
  }
  return (
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
      <Header {...logs}>
        <DatePickerWithRange
          selectedDateRange={dateRange}
          setDateRange={setDateRange}
        />
      </Header>
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
          />
        </div>
      )}
    </div>
  );
}
