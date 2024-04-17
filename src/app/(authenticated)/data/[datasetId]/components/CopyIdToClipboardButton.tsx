'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CopyIcon } from 'lucide-react';

type CopyIdToClipboardButtonProps = {
  id: string;
  hideId?: boolean;
};
const CopyIdToClipboardButton: React.FC<CopyIdToClipboardButtonProps> = ({
  id,
  hideId = false,
}) => {
  const { toast } = useToast();

  const handleOnClick = async () => {
    await navigator.clipboard.writeText(id);
    toast({
      duration: 2000,
      variant: 'default',
      description: id,
      title: 'ID copied to your clipboard',
    });
  };
  return (
    <Button
      variant={'ghost'}
      className="flex h-5 items-center gap-2 rounded-xl px-1.5 py-1 font-normal text-muted-foreground hover:text-muted-foreground"
      onClick={handleOnClick}
    >
      {!hideId && <span>{id}</span>}
      <CopyIcon size={16} />
    </Button>
  );
};

export default CopyIdToClipboardButton;
