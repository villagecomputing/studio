import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { ChangeEventHandler } from 'react';

type SearchInputProps = {
  onChange: (value: string) => void;
  value: string;
};

const SearchInput = (props: SearchInputProps) => {
  const inputOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    props.onChange(event.target.value);
  };

  return (
    <div className={cn('relative flex w-full max-w-96 items-center')}>
      <div className="absolute pl-3">
        <SearchIcon size={15} className="text-muted-foreground" />
      </div>
      <Input
        placeholder="Search"
        className="pl-9"
        onChange={inputOnChange}
        value={props.value}
      />
    </div>
  );
};

export { SearchInput };
