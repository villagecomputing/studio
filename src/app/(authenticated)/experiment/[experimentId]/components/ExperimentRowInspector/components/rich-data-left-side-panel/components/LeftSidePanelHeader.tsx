import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { PropsWithChildren } from 'react';

type LeftSidePanelHeaderProps = PropsWithChildren<{
  closePanel: () => void;
}>;
const LeftSidePanelHeader: React.FC<LeftSidePanelHeaderProps> = ({
  children,
  closePanel,
}) => {
  return (
    <div className="flex items-center gap-4 px-6 py-5">
      <Button variant={'outline'} className="h-7 w-7 p-0" onClick={closePanel}>
        <XIcon size={16} />
      </Button>
      {children}
    </div>
  );
};

export default LeftSidePanelHeader;
