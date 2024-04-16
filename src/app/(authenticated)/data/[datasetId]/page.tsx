import Breadcrumb from '@/components/Breadcrumb';
import { ENUM_Column_type } from '@/lib/types';
import { cn, createFakeId, getDatasetUuidFromFakeId } from '@/lib/utils';
import PageHeader from '../../components/page-header/PageHeader';
import { fetchDataSet } from './actions';
import CopyIdToClipboardButton from './components/CopyIdToClipboardButton';
import DataSetTable from './components/DataSetTable';
import { DatasetViewPageProps } from './types';

export default async function DatasetViewPage(props: DatasetViewPageProps) {
  const datasetId = getDatasetUuidFromFakeId(props.params.datasetId);
  const dataSet = await fetchDataSet(datasetId);

  // Filter out the 'ground truth' columnDef
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
