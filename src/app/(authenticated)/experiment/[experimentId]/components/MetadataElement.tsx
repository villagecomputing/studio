import { exhaustiveCheck } from '@/lib/typeUtils';
import { cn } from '@/lib/utils';
import { ArrowLeftRightIcon, BanknoteIcon, CrosshairIcon } from 'lucide-react';
import { ReactNode, useMemo } from 'react';

export enum Enum_Metadata_Type {
  COST = 'cost',
  LATENCY50 = 'latency50',
  LATENCY90 = 'latency90',
  ACCURACY = 'accuracy',
  RUNTIME = 'runtime',
  LABEL_VALUE = 'label-value',
}

type MetadataElementProps = {
  type: Enum_Metadata_Type;
  icon?: boolean;
  label?: string;
  value?: number;
  p25?: number;
  p75?: number;
};

const MetadataElement: React.FC<MetadataElementProps> = ({
  icon = false,
  label,
  value,
  type,
  p25,
  p75,
}) => {
  const disabled = !value;

  const data = useMemo(() => {
    let iconNode: ReactNode | null = null;
    let backgroundStatusColor: string = '';
    let formattedValue: string = '-';
    switch (type) {
      case Enum_Metadata_Type.COST: {
        iconNode = (
          <BanknoteIcon
            size={16}
            className={cn(disabled && 'text-muted-foreground')}
          />
        );
        if (value) {
          formattedValue = `$${parseFloat(value.toFixed(3))}`;
          if (p25 === undefined || p75 === undefined) {
            break;
          }
          if (value >= p75) {
            backgroundStatusColor = 'bg-lightRed';
          } else if (value <= p25) {
            backgroundStatusColor = 'bg-lightGreen';
          } else {
            backgroundStatusColor = 'bg-peach';
          }
        }
        break;
      }
      case Enum_Metadata_Type.LATENCY90:
      case Enum_Metadata_Type.LATENCY50: {
        iconNode = (
          <ArrowLeftRightIcon
            size={16}
            className={cn(disabled && 'text-muted-foreground')}
          />
        );
        if (value) {
          formattedValue = `${parseFloat(value.toFixed(3))}s`;
          if (p25 === undefined || p75 === undefined) {
            break;
          }
          if (value >= p75) {
            backgroundStatusColor = 'bg-lightRed';
          } else if (value <= p25) {
            backgroundStatusColor = 'bg-lightGreen';
          } else {
            backgroundStatusColor = 'bg-peach';
          }
        }
        break;
      }
      case Enum_Metadata_Type.ACCURACY: {
        iconNode = (
          <CrosshairIcon
            size={16}
            className={cn(disabled && 'text-muted-foreground')}
          />
        );
        if (value) {
          formattedValue = `${parseFloat(value.toFixed(3))}%`;
          if (p25 === undefined || p75 === undefined) {
            break;
          }
          if (value >= p75) {
            backgroundStatusColor = 'bg-lightGreen';
          } else if (value <= p25) {
            backgroundStatusColor = 'bg-lightRed';
          } else {
            backgroundStatusColor = 'bg-peach';
          }
        }
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
  }, [icon, type, value, disabled, p25, p75]);

  return (
    <div className={cn(['flex items-center', (label || icon) && 'gap-2'])}>
      <div
        className={cn([
          'flex items-center',
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
