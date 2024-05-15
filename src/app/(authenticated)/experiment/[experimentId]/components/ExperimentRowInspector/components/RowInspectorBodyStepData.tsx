import { LogsTableContext } from '@/app/(authenticated)/logs/[logsId]/types';
import { experimentStepOutputMapping } from '@/app/api/experiment/[experimentId]/insert/schema';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { ExperimentTableContext, StepMetadataColumn } from '../../../types';
import MetadataElement, { Enum_Metadata_Type } from '../../MetadataElement';
import RowInspectorRichDataWrapper from './RowInspectorRichDataWrapper';

const RowInspectorBodyStepData = (props: {
  stepMetadataColumn: StepMetadataColumn;
  context: ExperimentTableContext | LogsTableContext;
}) => {
  const { stepMetadataColumn, context } = props;
  const {
    rows,
    inspectorRowIndex,
    columnDefs,
    stepsMetadataPercentiles,
    sidePanelCurrentView,
    setSidePanelCurrentView,
  } = context;

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
      {!!stepMetadata.prompt && (
        <div className="flex flex-col gap-4">
          <div>
            <span className="mr-4 rounded-2xl border-[thin] border-border bg-paleGrey px-2 py-1">
              Input Prompt
            </span>
            {!!stepMetadata.input_tokens && (
              <span className="text-muted-foreground">
                <b className="mr-1">{stepMetadata.input_tokens}</b>Tokens
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 border-l border-border px-2">
            <RowInspectorRichDataWrapper
              title={'Input Prompt'}
              content={stepMetadata.prompt}
              currentViewContent={sidePanelCurrentView}
              setCurrentViewContent={(currentView) =>
                setSidePanelCurrentView(currentView)
              }
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {!!stepMetadata.output_column_fields.length && (
          <div>
            <span className="mr-4 rounded-2xl border-[thin] border-border bg-paleGrey px-2 py-1">
              Output
            </span>
            {!!stepMetadata.output_tokens && (
              <span className="text-muted-foreground">
                <b className="mr-1">{stepMetadata.output_tokens}</b>Tokens
              </span>
            )}
          </div>
        )}
        {stepMetadata.output_column_fields.map((outputColumnField) => {
          const outputColumn = columnDefs.find(
            (column) => column.field === outputColumnField,
          );
          if (!outputColumn) {
            return <></>;
          }
          const accuracy = Number(currentRow['accuracy']);
          let accuracyClass = '';
          if (
            currentRow['accuracy'] !== null &&
            !isNaN(accuracy) &&
            outputColumn.type === Enum_Experiment_Column_Type.OUTPUT
          ) {
            accuracyClass += ' rounded-lg border-[1px] ';

            if (accuracy >= 0 && accuracy < 0.3) {
              accuracyClass += 'bg-agWrongLabelColor';
            }
            if (accuracy >= 0.3 && accuracy < 0.7) {
              accuracyClass += 'bg-mid';
            }
            if (accuracy >= 0.7 && accuracy <= 1) {
              accuracyClass += 'bg-agGroundMatch';
            }
          }
          return (
            <div
              className={cn([
                'flex flex-col gap-1 border-l border-border p-2',
                accuracyClass,
              ])}
              key={outputColumnField}
            >
              <span className={'text-sm text-muted-foreground'}>
                {outputColumn.headerName}:
              </span>
              <RowInspectorRichDataWrapper
                title={outputColumn.headerName}
                content={(currentRow[outputColumnField] as string) || '-'}
                currentViewContent={sidePanelCurrentView}
                setCurrentViewContent={(currentView) =>
                  setSidePanelCurrentView(currentView)
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RowInspectorBodyStepData;
