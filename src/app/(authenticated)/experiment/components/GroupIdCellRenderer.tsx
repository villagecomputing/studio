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
    <div className="flex items-center text-sm" onClick={handleOnClick}>
      <span className="flex max-w-full items-center gap-2 self-start rounded-lg border-[thin] border-border bg-white px-2 py-1 hover:bg-paleGrey">
        <FolderIcon className="shrink-0" size={20}></FolderIcon>
        <span className="truncate">{`Group ${props.value}`}</span>
      </span>
    </div>
  );
};
export default GroupIdCellRenderer;
