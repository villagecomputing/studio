import { LogsTableContext } from '@/app/(authenticated)/logs/[logsId]/types';
import { CustomCellRendererProps } from 'ag-grid-react';
import { AlertTriangleIcon } from 'lucide-react';
import { useMemo } from 'react';
import { ExperimentRow, ExperimentTableContext } from '../types';
import { getExperimentRowMetadata } from '../utils';
import MetadataElement, { Enum_Metadata_Type } from './MetadataElement';

const RowMetadataCellRenderer = (
  props: CustomCellRendererProps<
    ExperimentRow,
    string,
    ExperimentTableContext | LogsTableContext
  >,
) => {
  const metadata = useMemo(() => {
    if (!props.data) {
      return null;
    }
    return getExperimentRowMetadata(
      props.data,
      props.context.stepMetadataColumns,
    );
  }, [props.data, props.context]);

  if (!metadata) {
    return <></>;
  }
  if (metadata.stepError.stepName) {
    return (
      <div className="flex h-full items-center gap-2 whitespace-nowrap">
        <div className="inline-block rounded-xl bg-red080 p-2 text-red500">
          <AlertTriangleIcon size={20} />
        </div>
        <span className="text-red500">
          Failed step: {metadata.stepError.stepName}
        </span>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex flex-wrap gap-3 pb-2">
        <MetadataElement
          type={Enum_Metadata_Type.LATENCY50}
          icon
          value={metadata.latencySum}
          p25={props.context.latencyP25}
          p75={props.context.latencyP75}
        />
        <MetadataElement
          type={Enum_Metadata_Type.COST}
          icon
          value={metadata.costSum}
          p25={props.context.costP25}
          p75={props.context.costP75}
        />
      </div>
      <MetadataElement
        type={Enum_Metadata_Type.LABEL_VALUE}
        value={metadata.inputTokensSum}
        label="Input tokens:"
      />
      <MetadataElement
        type={Enum_Metadata_Type.LABEL_VALUE}
        value={metadata.outputTokensSum}
        label="Output tokens:"
      />
    </div>
  );
};

export default RowMetadataCellRenderer;
