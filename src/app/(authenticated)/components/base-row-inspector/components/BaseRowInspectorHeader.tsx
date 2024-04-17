import { Button } from '@/components/ui/button';
import { ArrowDownIcon, ArrowUpIcon, XIcon } from 'lucide-react';
import { BaseRowInspectorHeaderProps } from '../type';

export const BaseRowInspectorHeader: React.FC<BaseRowInspectorHeaderProps> = (
  props,
) => {
  const { children, onClose, title } = props;

  return (
    <div className="border-b-[1px] border-border bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <span>{title}</span>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            Use <b>Up</b>
            <span className="flex h-6 w-6 items-center justify-center rounded border border-border text-secondary-foreground">
              <ArrowUpIcon height={24} width={14} />
            </span>
            and <b>Down</b>
            <span className="flex h-6 w-6 items-center justify-center rounded border border-border text-secondary-foreground">
              <ArrowDownIcon height={24} width={14} />
            </span>
            keys to navigate
          </span>
          <Button
            onClick={onClose}
            variant={'outline'}
            className="h-7 w-7 p-0 text-secondary-foreground"
          >
            <XIcon size={14} />
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
};
