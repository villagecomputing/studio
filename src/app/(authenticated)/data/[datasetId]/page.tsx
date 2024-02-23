import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SearchInput } from '../../components/search-input/SearchInput';
import { fetchDataSet } from './actions';
import DataSetTable from './components/DataSetTable';

type DatasetViewPageProps = {
  params: {
    datasetId: number;
  };
};

export default async function DatasetViewPage(props: DatasetViewPageProps) {
  const {
    params: { datasetId },
  } = props;
  const dataSet = await fetchDataSet(Number(datasetId));

  return (
    <div>
      <div className={cn(['flex items-center justify-between p-6'])}>
        <SearchInput />
        <Button variant={'outline'}>Download</Button>
      </div>
      {dataSet && <DataSetTable data={dataSet} />}
    </div>
  );
}
