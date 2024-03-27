import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CustomCellRendererProps } from 'ag-grid-react';
import { Link2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MouseEvent } from 'react';

type DatasetNameProps = {
  name: string;
  id: string;
  variant: 'outline' | 'secondary';
};
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
    <Button
      variant={props.variant}
      onClick={handleOnClick}
      className={cn([
        props.variant === 'outline' && 'h-7 rounded-lg px-2 py-1',
        'flex max-w-full items-center gap-2',
      ])}
    >
      <Link2Icon
        className="shrink-0 text-muted-foreground"
        size={20}
      ></Link2Icon>
      <span className="truncate">{props.name}</span>
    </Button>
  );
};

const DatasetNameCellRenderer = (
  props: CustomCellRendererProps<unknown, string, unknown>,
) => {
  return (
    <DatasetName
      id={props.value || ''}
      name={props.valueFormatted || ''}
      variant="outline"
    ></DatasetName>
  );
};
export default DatasetNameCellRenderer;
