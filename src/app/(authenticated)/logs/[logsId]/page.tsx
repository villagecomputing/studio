import Breadcrumb from '@/components/Breadcrumb';
import {
  UUIDPrefixEnum,
  cn,
  createFakeId,
  getUuidFromFakeId,
} from '@/lib/utils';
import { InfoIcon } from 'lucide-react';
import CopyIdToClipboardButton from '../../data/[datasetId]/components/CopyIdToClipboardButton';
import { fetchLogs } from './actions';
import Header from './components/Header';
import LogsTable from './components/LogsTable';
import { LogsViewPageProps } from './types';

export default async function LogsViewPage(props: LogsViewPageProps) {
  const logsId = getUuidFromFakeId(props.params.logsId, UUIDPrefixEnum.LOGS);
  const logs = await fetchLogs(logsId);

  return (
    <div>
      <div className={cn(['flex items-center gap-2 px-6'])}>
        <Breadcrumb
          customSegments={{
            [logsId.toString()]: logs?.logsName,
          }}
        />
        <CopyIdToClipboardButton id={createFakeId(logs.logsName, logsId)} />
      </div>
      <Header logs={logs} />

      {!logs.rowData.length ? (
        <div className="border-t border-gridBorderColor pt-6">
          <div className="flex w-full items-center justify-center gap-2 text-muted-foreground">
            <InfoIcon size={20} />
            <span>No logs data.</span>
          </div>
        </div>
      ) : (
        <div style={{ height: 'calc(100vh - 130px)' }}>
          <LogsTable {...logs} />
        </div>
      )}
    </div>
  );
}
