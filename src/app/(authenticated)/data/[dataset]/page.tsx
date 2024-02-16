import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SearchInput } from '../../components/search-input/SearchInput';

export default function DatasetViewPage() {
  return (
    <div>
      <div className={cn(['flex items-center justify-between p-6'])}>
        <SearchInput />
        <Button variant={'outline'}>Download</Button>
      </div>
    </div>
  );
}
