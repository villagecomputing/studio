import { isGroundTruthCell } from '@/app/(authenticated)/data/utils/commonUtils';
import { experimentStepMetadata } from '@/app/api/experiment/[experimentId]/insert/schema';
import { CustomCellRendererProps } from 'ag-grid-react';
import { AlertTriangleIcon } from 'lucide-react';
import { useMemo } from 'react';
import { ExperimentRow, ExperimentTableContext } from '../types';
import MetadataElement from './MetadataElement';

const RowMetadataCellRenderer = (
  props: CustomCellRendererProps<ExperimentRow, string, ExperimentTableContext>,
) => {
  const metadata = useMemo(() => {
    if (!props.data) {
      return null;
    }
    const stepsMetadataColumns = props.context.stepMetadataColumns;
    // const latencyMetadata = !isGroundTruthCell(
    //   props.data[DYNAMIC_EXPERIMENT_LATENCY_FIELD],
    // )
    //   ? props.data[DYNAMIC_EXPERIMENT_LATENCY_FIELD]
    //   : 0;

    let latencySum = 0;
    let costSum = 0;
    let inputTokensSum = 0;
    let outputTokensSum = 0;
    let stepError: { stepName: string; error: string | null } | null = null;

    stepsMetadataColumns.forEach((column) => {
      const value = props.data?.[column.field];
      if (!value || isGroundTruthCell(value)) {
        return;
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
      }
      latencySum += latency;
      costSum += (input_cost ?? 0) + (output_cost ?? 0);
      inputTokensSum += input_tokens ?? 0;
      outputTokensSum += output_tokens ?? 0;
    });

    return {
      latencySum: parseFloat(latencySum.toFixed(3)),
      costSum: parseFloat(costSum.toFixed(3)),
      inputTokensSum,
      outputTokensSum,
      stepError,
    };
  }, [props.data, props.context]);

  if (!metadata) {
    return <></>;
  }
  if (metadata.stepError) {
    return (
      <div className="flex items-center gap-3 whitespace-nowrap">
        <div className="inline-block rounded-lg bg-red080 p-2 text-red500">
          <AlertTriangleIcon size={20} />
        </div>
        <span className="text-red500">
          Failed step:
          {/* {metadata.stepError.stepName} */}
        </span>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <MetadataElement
          status="green"
          icon="latency"
          value={`${metadata.latencySum}s`}
        />
        <MetadataElement
          status="green"
          icon="price"
          value={`$${metadata.costSum}`}
        />
      </div>
      <div>Input tokens: {metadata.inputTokensSum}</div>
      <div>Output tokens: {metadata.outputTokensSum}</div>
    </>
  );
};

export default RowMetadataCellRenderer;
