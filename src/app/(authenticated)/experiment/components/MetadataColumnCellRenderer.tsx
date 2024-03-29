import { isSomeStringEnum } from '@/lib/typeUtils';
import { CustomCellRendererProps } from 'ag-grid-react';
import MetadataElement, {
  Enum_Metadata_Type,
} from '../[experimentId]/components/MetadataElement';

const MetadataColumnCellRenderer = (
  props: CustomCellRendererProps<unknown, number, unknown>,
) => {
  const metadataType = props.colDef?.type;
  if (!metadataType || !isSomeStringEnum(Enum_Metadata_Type, metadataType)) {
    return props.valueFormatted;
  }

  return <MetadataElement type={metadataType} value={props.value ?? 0} />;
};

export default MetadataColumnCellRenderer;
