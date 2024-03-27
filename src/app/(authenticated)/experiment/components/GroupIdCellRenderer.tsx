import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CustomCellRendererProps } from 'ag-grid-react';
import { FolderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MouseEvent } from 'react';

const GroupIdCellRenderer = (
  props: CustomCellRendererProps<unknown, string, unknown>,
) => {
  const router = useRouter();

  const handleOnClick = async (event: MouseEvent) => {
    event.stopPropagation();
    if (!props.value) {
      return;
    }
    router.push(`/group/${props.value}`);
  };

  return (
    <Button
      variant="outline"
      onClick={handleOnClick}
      className={cn([
        'flex h-7 max-w-full items-center gap-2 rounded-lg px-2 py-1',
      ])}
    >
      <FolderIcon
        className="shrink-0 text-muted-foreground"
        size={20}
      ></FolderIcon>
      <span className="truncate">{`Group ${props.value}`}</span>
    </Button>
  );
};
export default GroupIdCellRenderer;
