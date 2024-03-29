import { exhaustiveCheck } from '@/lib/typeUtils';
import { cn } from '@/lib/utils';
import { ArrowLeftRightIcon, BanknoteIcon, CrosshairIcon } from 'lucide-react';
import { ReactNode } from 'react';

export enum Enum_Metadata_Type {
  COST = 'cost',
  LATENCY = 'latency',
  ACCURACY = 'accuracy',
  RUNTIME = 'runtime',
  LABEL_VALUE = 'label-value',
}

type MetadataElementProps = {
  type: Enum_Metadata_Type;
  icon?: boolean;
  label?: string;
  value?: number;
};

const MetadataElement: React.FC<MetadataElementProps> = ({
  icon = false,
  label,
  value,
  type,
}) => {
  const disabled = !value;

  const data = (() => {
    let iconNode: ReactNode | null = null;
    let backgroundStatusColor: string = '';
    let formattedValue: string = '-';
    switch (type) {
      case Enum_Metadata_Type.COST: {
        if (value) {
          formattedValue = `$${parseFloat(value.toFixed(3))}`;
        }
        // TODO: update this based on value range
        backgroundStatusColor = 'bg-lightRed';
        iconNode = (
          <BanknoteIcon
            size={16}
            className={cn(disabled && 'text-muted-foreground')}
          />
        );
        break;
      }
      case Enum_Metadata_Type.LATENCY: {
        if (value) {
          formattedValue = `${parseFloat(value.toFixed(3))}s`;
        }
        // TODO: update this based on value range
        backgroundStatusColor = 'bg-lightGreen';
        iconNode = (
          <ArrowLeftRightIcon
            size={16}
            className={cn(disabled && 'text-muted-foreground')}
          />
        );
        break;
      }
      case Enum_Metadata_Type.ACCURACY: {
        if (value) {
          formattedValue = `${parseFloat(value.toFixed(3))}%`;
        }
        // TODO: update this based on value range
        backgroundStatusColor = 'bg-peach';
        iconNode = (
          <CrosshairIcon
            size={16}
            className={cn(disabled && 'text-muted-foreground')}
          />
        );
        break;
      }
      case Enum_Metadata_Type.RUNTIME: {
        if (value) {
          const minutes = Math.floor(value / 60);
          const seconds = minutes
            ? parseInt((value % 60).toFixed(0))
            : parseFloat((value % 60).toFixed(3));
          const formattedMinutes = minutes ? `${minutes}m ` : '';
          formattedValue = `${formattedMinutes}${seconds}s`;
        }
        break;
      }
      case Enum_Metadata_Type.LABEL_VALUE: {
        if (value) {
          formattedValue = value.toString();
        }
        break;
      }
      default:
        exhaustiveCheck(type);
    }
    return {
      iconNode: icon ? iconNode : null,
      backgroundStatusColor: disabled
        ? 'bg-muted rounded-lg p-1'
        : `p-1 rounded-lg ${backgroundStatusColor}`,
      formattedValue: value ? formattedValue : '-',
    };
  })();

  return (
    <div className={cn(['flex items-center', (label || icon) && 'gap-2'])}>
      <div
        className={cn([
          'flex',
          label && 'gap-1',
          icon && `${data.backgroundStatusColor}`,
        ])}
      >
        {data.iconNode}
        <div
          className={cn([
            !icon
              ? 'text-sm text-muted-foreground'
              : 'text-xs text-secondary-foreground',
          ])}
        >
          {label}
        </div>
      </div>

      <div
        className={cn([
          !icon && !label && value && `${data.backgroundStatusColor}`,
          !icon && !label && 'px-2',
          disabled && 'text-muted-foreground',
          'text-sm font-normal text-secondary-foreground',
        ])}
      >
        {data.formattedValue}
      </div>
    </div>
  );
};

export default MetadataElement;
