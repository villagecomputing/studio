import { isGroundTruthCell } from '@/app/(authenticated)/data/utils/commonUtils';
import { experimentStepMetadata } from '@/app/api/experiment/[experimentId]/insert/schema';
import { CustomCellRendererProps } from 'ag-grid-react';
import { AlertTriangleIcon } from 'lucide-react';
import { useMemo } from 'react';
import { ExperimentRow, ExperimentTableContext } from '../types';
import MetadataElement, { Enum_Metadata_Type } from './MetadataElement';

const RowMetadataCellRenderer = (
  props: CustomCellRendererProps<ExperimentRow, string, ExperimentTableContext>,
) => {
  const metadata = useMemo(() => {
    if (!props.data) {
      return null;
    }
    const stepsMetadataColumns = props.context.stepMetadataColumns;

    let latencySum = 0;
    let costSum = 0;
    let inputTokensSum = 0;
    let outputTokensSum = 0;
    let stepError: { stepName?: string; error?: string | null } = {};

    for (const column of stepsMetadataColumns) {
      const value = props.data?.[column.field];
      if (!value || isGroundTruthCell(value)) {
        continue;
      }
      const metadata = JSON.parse(value);
      const {
        latency,
        input_cost,
        output_cost,
        input_tokens,
        output_tokens,
        success,
        error,
      } = experimentStepMetadata.parse(metadata);
      if (!success) {
        stepError = { stepName: column.name, error };
        break;
      }
      latencySum += latency;
      costSum += (input_cost ?? 0) + (output_cost ?? 0);
      inputTokensSum += input_tokens ?? 0;
      outputTokensSum += output_tokens ?? 0;
    }

    return {
      latencySum,
      costSum,
      inputTokensSum,
      outputTokensSum,
      stepError,
    };
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
          type={Enum_Metadata_Type.LATENCY}
          icon
          value={metadata.latencySum}
        />
        <MetadataElement
          type={Enum_Metadata_Type.COST}
          icon
          value={metadata.costSum}
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
