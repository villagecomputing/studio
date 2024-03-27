import { exhaustiveCheck } from '@/lib/typeUtils';
import { cn } from '@/lib/utils';
import { ArrowLeftRightIcon, BanknoteIcon, CrosshairIcon } from 'lucide-react';
import { useMemo } from 'react';

type MetadataElementProps = {
  icon: 'price' | 'latency' | 'accuracy' | 'none';
  label?: string;
  value?: string;
  status: 'disabled' | 'red' | 'green' | 'yellow' | 'none';
};

const MetadataElement: React.FC<MetadataElementProps> = ({
  icon,
  label,
  value = '-',
  status,
}) => {
  const backgroundStatusColor = useMemo(() => {
    switch (status) {
      case 'disabled':
        return 'bg-muted';
      case 'red':
        return 'bg-lightRed';
      case 'green':
        return 'bg-lightGreen';
      case 'yellow':
        return 'bg-peach';
      case 'none':
        return '';
      default:
        exhaustiveCheck(status);
        return '';
    }
  }, [status]);

  const iconNode = useMemo(() => {
    switch (icon) {
      case 'price':
        return (
          <BanknoteIcon
            size={16}
            className={cn(status === 'disabled' ? 'text-muted-foreground' : '')}
          />
        );
      case 'latency':
        return (
          <ArrowLeftRightIcon
            size={16}
            className={cn(status === 'disabled' && 'text-muted-foreground')}
          />
        );
      case 'accuracy':
        return (
          <CrosshairIcon
            size={16}
            className={cn(status === 'disabled' && 'text-muted-foreground')}
          />
        );
      case 'none':
        return <></>;
      default:
        exhaustiveCheck(icon);
        return <></>;
    }
  }, [icon, status]);

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn([
          'flex rounded p-1 ',
          label && 'gap-1',
          icon !== 'none' && backgroundStatusColor,
        ])}
      >
        {iconNode}
        <div
          className={cn([
            icon === 'none'
              ? 'text-sm text-muted-foreground'
              : 'text-xs text-secondary-foreground',
          ])}
        >
          {label}
        </div>
      </div>

      <div
        className={cn([
          icon === 'none' && !label && backgroundStatusColor,
          status === 'disabled' && 'text-muted-foreground',
          'text-sm font-normal text-secondary-foreground',
        ])}
      >
        {value}
      </div>
    </div>
  );
};

export default MetadataElement;
