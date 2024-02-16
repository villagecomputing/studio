import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';

const SearchInput = () => {
  return (
    <div className={cn('relative flex w-full max-w-96 items-center')}>
      <div className="absolute pl-3">
        <SearchIcon size={15} className="text-muted-foreground" />
      </div>
      <Input placeholder="Search" className="pl-9" />
    </div>
  );
};

export { SearchInput };
