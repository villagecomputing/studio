import { cn } from '@/lib/utils';
import { CustomCellRendererProps } from 'ag-grid-react';
import { Link2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MouseEvent } from 'react';
import { DatasetNameProps } from '../types';

export const DatasetName: React.FC<DatasetNameProps> = (props) => {
  const router = useRouter();

  const handleOnClick = async (event: MouseEvent) => {
    event.stopPropagation();
    if (!props.id) {
      return;
    }
    router.push(`/data/${props.id}`);
  };

  return (
    <div
      className="flex cursor-pointer items-center text-sm"
      onClick={handleOnClick}
    >
      <span
        className={cn([
          'flex max-w-full items-center gap-2 self-start rounded-lg border-[thin] border-border bg-white px-2 py-1 hover:bg-paleGrey',
          props.className,
        ])}
      >
        <Link2Icon className="shrink-0 text-primary" size={20}></Link2Icon>
        <span className="truncate">{`${props.name}`}</span>
      </span>
    </div>
  );
};

const DatasetNameCellRenderer = (
  props: CustomCellRendererProps<unknown, string, unknown>,
) => {
  return (
    <DatasetName
      id={props.value || ''}
      name={props.valueFormatted || ''}
    ></DatasetName>
  );
};
export default DatasetNameCellRenderer;
