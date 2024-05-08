'use client';
import Breadcrumb from '@/components/Breadcrumb';
import Loading from '@/components/loading/Loading';
import { useToast } from '@/components/ui/use-toast';
import { DATASET_REFETCH_INTERVAL_MS } from '@/lib/constants';
import { ENUM_Column_type } from '@/lib/types';
import {
  UUIDPrefixEnum,
  cn,
  createFakeId,
  getUuidFromFakeId,
} from '@/lib/utils';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';
import PageHeader from '../../components/page-header/PageHeader';
import { fetchDataSet } from './actions';
import CopyIdToClipboardButton from './components/CopyIdToClipboardButton';
import DataSetTable from './components/DataSetTable';
import { DatasetViewPageProps } from './types';

export default function DatasetViewPage(props: DatasetViewPageProps) {
  const datasetId = getUuidFromFakeId(
    props.params.datasetId,
    UUIDPrefixEnum.DATASET,
  );
  const {
    data: dataSet,
    error,
    isLoading,
  } = useSWR(datasetId, fetchDataSet, {
    refreshInterval: DATASET_REFETCH_INTERVAL_MS,
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
      console.error('ERROR', error);
    }
    if (!dataSet) {
      redirect('/data');
    }
  }, [dataSet, isLoading, error]);

  if (!dataSet) {
    return <Loading />;
  }

  const colDefReordered =
    dataSet?.columnDefs.filter(
      (def) => def.type !== ENUM_Column_type.GROUND_TRUTH,
    ) ?? [];
  // Find the 'ground truth' columnDef and add it to the end of the array
  const groundTruthColDef = dataSet?.columnDefs.find(
    (def) => def.type === ENUM_Column_type.GROUND_TRUTH,
  );
  if (groundTruthColDef) {
    colDefReordered.push(groundTruthColDef);
  }
  return (
    <div>
      <PageHeader>
        <div className={cn(['flex items-center gap-2'])}>
          <Breadcrumb
            customSegments={{ [datasetId.toString()]: dataSet?.datasetName }}
          />
          <CopyIdToClipboardButton
            id={createFakeId(dataSet?.datasetName ?? '', datasetId)}
          />
        </div>
      </PageHeader>
      {dataSet && (
        <div style={{ height: 'calc(100vh - 130px)' }}>
          <DataSetTable
            datasetName={dataSet.datasetName}
            datasetId={datasetId}
            rowData={dataSet.rowData}
            columnDefs={colDefReordered}
            pinnedBottomRowData={dataSet.pinnedBottomRowData}
          />
        </div>
      )}
    </div>
  );
}
