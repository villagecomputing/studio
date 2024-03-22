import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CustomCellRendererProps } from 'ag-grid-react';
import { CopyIcon } from 'lucide-react';

const FakeIdCellRenderer = (
  props: CustomCellRendererProps<unknown, string, unknown>,
) => {
  const { toast } = useToast();

  const handleOnClick = async () => {
    if (!props.value) {
      return;
    }
    await navigator.clipboard.writeText(props.value);
    toast({
      duration: 2000,
      variant: 'default',
      description: 'Id copied to clipboard',
    });
  };

  return (
    <div className="p-0">
      <Button variant={'ghost'} onClick={handleOnClick}>
        <CopyIcon size={16} />
      </Button>
    </div>
  );
};
export default FakeIdCellRenderer;
