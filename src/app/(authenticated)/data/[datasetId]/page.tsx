import Breadcrumb from '@/components/Breadcrumb';
import { cn } from '@/lib/utils';
import { fetchDataSet } from './actions';
import DataSetTable from './components/DataSetTable';
import { DatasetViewPageProps } from './types';

export default async function DatasetViewPage(props: DatasetViewPageProps) {
  const {
    params: { datasetId },
  } = props;
  const dataSet = await fetchDataSet(Number(datasetId));

  return (
    <div>
      <div className={cn(['px-6'])}>
        <Breadcrumb
          customSegments={{ [datasetId.toString()]: dataSet?.datasetName }}
        />
      </div>
      {dataSet && (
        <div style={{ height: 'calc(100vh - 130px)' }}>
          <DataSetTable
            rowData={dataSet.rowData}
            columnDefs={dataSet.columnDefs}
            pinnedBottomRowData={dataSet.pinnedBottomRowData}
          />
        </div>
      )}
    </div>
  );
}
