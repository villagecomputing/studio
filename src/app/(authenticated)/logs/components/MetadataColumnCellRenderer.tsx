import { isSomeStringEnum } from '@/lib/typeUtils';
import { CustomCellRendererProps } from 'ag-grid-react';
import MetadataElement, {
  Enum_Metadata_Type,
} from '../[logsId]/components/MetadataElement';
import { LogsListAGGridContext } from '../types';

const MetadataColumnCellRenderer = (
  props: CustomCellRendererProps<unknown, number, LogsListAGGridContext>,
) => {
  const metadataType = props.colDef?.type;
  if (!metadataType || !isSomeStringEnum(Enum_Metadata_Type, metadataType)) {
    return props.valueFormatted;
  }

  return (() => {
    switch (metadataType) {
      case Enum_Metadata_Type.ACCURACY:
        return (
          <MetadataElement
            type={metadataType}
            p25={props.context.avgAccuracyColumnP25}
            p75={props.context.avgAccuracyColumnP75}
            value={props.value ?? 0}
          />
        );
      case Enum_Metadata_Type.COST:
        return (
          <MetadataElement
            type={metadataType}
            p25={props.context.avgCostColumnP25}
            p75={props.context.avgCostColumnP75}
            value={props.value ?? 0}
          />
        );
      case Enum_Metadata_Type.LATENCY50:
        return (
          <MetadataElement
            type={metadataType}
            p25={props.context.latencyP50ColumnP25}
            p75={props.context.latencyP50ColumnP75}
            value={props.value ?? 0}
          />
        );
      case Enum_Metadata_Type.LATENCY90:
        return (
          <MetadataElement
            type={metadataType}
            p25={props.context.latencyP90ColumnP25}
            p75={props.context.latencyP90ColumnP75}
            value={props.value ?? 0}
          />
        );
      default:
        return <MetadataElement type={metadataType} value={props.value ?? 0} />;
    }
  })();
};

export default MetadataColumnCellRenderer;
