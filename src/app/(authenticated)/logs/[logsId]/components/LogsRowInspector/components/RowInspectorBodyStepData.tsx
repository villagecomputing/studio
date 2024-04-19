import { CollapsibleText } from '@/app/(authenticated)/components/base-row-inspector/components/CollapsibleText';
import MetadataElement, {
  Enum_Metadata_Type,
} from '@/app/(authenticated)/experiment/[experimentId]/components/MetadataElement';
import { StepMetadataColumn } from '@/app/(authenticated)/experiment/[experimentId]/types';
import { experimentStepOutputMapping } from '@/app/api/experiment/[experimentId]/insert/schema';
import { useMemo } from 'react';
import { useLogsRowInspectorContext } from '../LogsRowInspector';

const RowInspectorBodyStepData = (props: {
  stepMetadataColumn: StepMetadataColumn;
}) => {
  const { stepMetadataColumn } = props;
  const { rows, inspectorRowIndex, columnDefs, stepsMetadataPercentiles } =
    useLogsRowInspectorContext();

  const currentRow =
    inspectorRowIndex !== null ? rows[inspectorRowIndex] : undefined;

  const stepMetadata = useMemo(() => {
    if (!currentRow) {
      return;
    }
    const metadata = JSON.parse(currentRow[stepMetadataColumn.field] as string);
    return experimentStepOutputMapping.parse(metadata);
  }, [currentRow, stepMetadataColumn]);

  const stepName = stepMetadataColumn.name.replace(/^_+|_+$/g, '').trim();
  const stepMetadataPercentiles = stepsMetadataPercentiles.hasOwnProperty(
    stepMetadataColumn.field,
  )
    ? stepsMetadataPercentiles[stepMetadataColumn.field]
    : undefined;
  if (!stepMetadata || !currentRow) {
    return <></>;
  }

  return (
    <div
      id={stepMetadataColumn.field}
      className="flex flex-col gap-6 border-y border-border bg-white p-6"
    >
      <div className="flex justify-between text-base">
        <span>{stepName}</span>
        <div className="flex items-center gap-4">
          {!!stepMetadata.latency && (
            <MetadataElement
              type={Enum_Metadata_Type.LATENCY90}
              icon
              value={stepMetadata.latency}
              p25={stepMetadataPercentiles?.latencyP25}
              p75={stepMetadataPercentiles?.latencyP75}
            />
          )}
          {!!stepMetadata.input_cost && !!stepMetadata.output_cost && (
            <MetadataElement
              type={Enum_Metadata_Type.COST}
              icon
              value={stepMetadata.input_cost + stepMetadata.output_cost}
              p25={stepMetadataPercentiles?.costP25}
              p75={stepMetadataPercentiles?.costP75}
            />
          )}
        </div>
      </div>
      {!!stepMetadata.prompt && !!stepMetadata.input_tokens && (
        <div className="flex flex-col gap-4">
          <div>
            <span className="mr-4 rounded-2xl border-[thin] border-border bg-paleGrey px-2 py-1">
              Input Prompt
            </span>
            <span className="text-muted-foreground">
              <b className="mr-1">{stepMetadata.input_tokens}</b>Tokens
            </span>
          </div>
          <div className="flex flex-col gap-1 border-l border-border px-2">
            <CollapsibleText text={stepMetadata.prompt} />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {!!stepMetadata.output_tokens && (
          <div>
            <span className="mr-4 rounded-2xl border-[thin] border-border bg-paleGrey px-2 py-1">
              Output
            </span>
            <span className="text-muted-foreground">
              <b className="mr-1">{stepMetadata.output_tokens}</b>Tokens
            </span>
          </div>
        )}
        {stepMetadata.output_column_fields.map((outputColumnField) => {
          const outputColumn = columnDefs.find(
            (column) => column.field === outputColumnField,
          );
          if (!outputColumn) {
            return <></>;
          }
          return (
            <div
              className="flex flex-col gap-1 border-l border-border px-2"
              key={outputColumnField}
            >
              <span className={'text-sm text-muted-foreground'}>
                {outputColumn.headerName}:
              </span>
              <CollapsibleText
                text={(currentRow[outputColumnField] as string) || '-'}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RowInspectorBodyStepData;
