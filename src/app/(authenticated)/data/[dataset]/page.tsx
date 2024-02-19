import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SearchInput } from '../../components/search-input/SearchInput';
import DataSetTable from './components/DataSetTable';

const fetchDataSet = async () => {
  const response = await fetch('https://api.spacexdata.com/v3/launches', {
    cache: 'no-store',
  });
  const data = await response.json();
  return data;
};

export default async function DatasetViewPage() {
  const dataSet = await fetchDataSet();

  return (
    <div>
      <div className={cn(['flex items-center justify-between p-6'])}>
        <SearchInput />
        <Button variant={'outline'}>Download</Button>
      </div>
      <DataSetTable data={dataSet} />
    </div>
  );
}
